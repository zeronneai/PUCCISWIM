#!/usr/bin/env node
//
// Warm the Cloudinary frame cache BEFORE launch.
//
// The FIRST request for each so_<i>p frame triggers Cloudinary's on-the-fly
// transform (slow); after that it's cached at their CDN edge. Run this once
// before going live or the first visitor scrubs the hero frame-by-frame while
// each frame generates.
//
//   node scripts/warm-frames.mjs
//
// Prints per-orientation: how many of the 100 URLs returned 200, the average
// frame weight (from Content-Length), and timing. Concurrency 8.
//
// NOTE: keep MASTERS / HERO_FRAME_COUNT in sync with lib/heroSequence.ts.

const HERO_FRAME_COUNT = 100;
const CLOUD = "https://res.cloudinary.com/dsprn0ew4/video/upload";
const MASTERS = {
  landscape: {
    id: "v1785339368/hf_20260729_150441_3c675dd5-9d54-44b9-813e-bff0bf18f9cb_vv5bmg",
    width: 1600,
    quality: 70,
  },
  portrait: {
    id: "v1785339370/hf_20260729_150422_57a0fa85-e360-4125-b8cd-f2bc7140f031_erdwxl",
    width: 900,
    quality: 65,
  },
};
const CONCURRENCY = 8;

const frameSrc = (o, i) => {
  const m = MASTERS[o];
  return `${CLOUD}/so_${i}p,w_${m.width},c_scale,q_${m.quality}/${m.id}.webp`;
};

async function warmOne(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { method: "HEAD" });
    const ms = Date.now() - t0;
    const len = Number(res.headers.get("content-length")) || 0;
    return { url, status: res.status, ms, bytes: len };
  } catch (err) {
    return { url, status: 0, ms: Date.now() - t0, bytes: 0, error: String(err?.message || err) };
  }
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function loop() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => loop()));
  return results;
}

async function warmOrientation(o) {
  const urls = Array.from({ length: HERO_FRAME_COUNT }, (_, i) => frameSrc(o, i));
  process.stdout.write(`\n== ${o} (${urls.length} frames) ==\n`);
  const started = Date.now();
  const results = await runPool(urls, async (url, i) => {
    const r = await warmOne(url);
    const tag = r.status === 200 ? "OK " : `!! ${r.status}`;
    process.stdout.write(
      `  [${String(i).padStart(3)}] ${tag}  ${String(r.ms).padStart(5)}ms  ${(r.bytes / 1024).toFixed(1)}KB\n`,
    );
    return r;
  }, CONCURRENCY);

  const ok = results.filter((r) => r.status === 200);
  const withSize = ok.filter((r) => r.bytes > 0);
  const totalBytes = withSize.reduce((s, r) => s + r.bytes, 0);
  const avgKB = withSize.length ? totalBytes / withSize.length / 1024 : 0;
  const avgMs = results.reduce((s, r) => s + r.ms, 0) / results.length;
  const wall = ((Date.now() - started) / 1000).toFixed(1);

  return {
    orientation: o,
    total: results.length,
    ok: ok.length,
    avgKB,
    setMB: totalBytes / 1024 / 1024,
    avgMs: Math.round(avgMs),
    wallSec: wall,
  };
}

(async () => {
  const summaries = [];
  for (const o of Object.keys(MASTERS)) {
    summaries.push(await warmOrientation(o));
  }
  console.log("\n================ SUMMARY ================");
  for (const s of summaries) {
    console.log(
      `${s.orientation.padEnd(10)} ${s.ok}/${s.total} → 200 · avg ${s.avgKB.toFixed(1)}KB/frame · ` +
        `set ~${s.setMB.toFixed(1)}MB · avg ${s.avgMs}ms · ${s.wallSec}s wall`,
    );
  }
  const allOk = summaries.every((s) => s.ok === s.total);
  console.log(allOk ? "\nAll frames warmed ✓" : "\n⚠ Some frames did not return 200. Re-run to retry.");
  process.exit(allOk ? 0 : 1);
})();
