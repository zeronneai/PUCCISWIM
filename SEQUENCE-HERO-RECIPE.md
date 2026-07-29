# SEQUENCE-HERO-RECIPE: Hero de scroll-scrub con secuencia de frames en canvas

Receta reproducible del hero de Four O's Timepieces: un video master se convierte
en una secuencia de frames WebP que se "scrubbea" con el scroll sobre un
`<canvas>` fijado (pinned), con beats de texto sincronizados al progreso.
Documento generado por auditoría del repo el 2026-07-28 (commits `e49b4b6` y
`f4029ba` son la fuente principal).

---

## 1. Origen del material: DOS videos master (no clips sueltos)

| Master | Archivo | Formato | Duración | Aspecto |
|---|---|---|---|---|
| Landscape | `assets/hero-master-landscape.MOV` (12 MB) | QuickTime .MOV | **15.2 s** | 16:9 |
| Portrait | `assets/hero-master-portrait.MOV` (13 MB) | QuickTime .MOV | **13.2 s** | 9:16 |

- Cada master es UNA sola toma continua con la narrativa completa ya editada
  dentro: **logo → morph con push-in → vista frontal → rotación → explosión
  (despiece)**. No se concatenaron clips: el montaje viene "horneado" en el
  master. Esto simplifica todo: 1 video = 1 secuencia = 1 timeline.
- Historia en git: primero hubo un único `assets/hero-master.mov` (commit
  `e49b4b6`, secuencia única 1600px + variante `sm/` 720px); en `f4029ba` se
  reemplazó por los dos masters por orientación y se borraron `sequence/`,
  `sequence/sm/`, y los poster/fallback antiguos.

## 2. Inventario de frames en `public/sequence/`

Dos sets, **115 frames cada uno**, nombrados `frame-001.webp … frame-115.webp`
(1-indexados en disco):

| Set | Carpeta | Resolución | Formato | Peso total | Rango por frame |
|---|---|---|---|---|---|
| Landscape | `public/sequence/lg/` | **1920×1072** | WebP (VP8, lossy) | **6.2 MB** | 23.9 KB - 78.8 KB |
| Portrait | `public/sequence/pt/` | **1072×1920** | WebP (VP8, lossy) | **6.2 MB** | 13.0 KB - 87.4 KB |

- Resolución **nativa del master, nunca upscaled** (nota del commit). 1072 no es
  un error: es el alto/ancho nativo (divisible por 16, video-friendly).
- Calidad WebP según commit: **q80 el landscape, q73 el portrait** (el q73 fue
  para mantener el set portrait en ~6 MB pese a tener más área de reloj).
- Assets acompañantes en `public/`: `hero-poster-lg.jpg` (51 KB),
  `hero-poster-pt.jpg` (33 KB), `hero-fallback-lg.mp4` (6.6 MB),
  `hero-fallback-pt.mp4` (5.9 MB, ambos ~3.5 Mbps 1080p según commit).

## 3. Comando ffmpeg de extracción

⚠️ **El comando exacto NO quedó registrado en el repo** (no hay script de
extracción ni nota en README; se corrió a mano en la sesión que produjo
`f4029ba`). Lo siguiente es la **reconstrucción equivalente** a partir de los
parámetros verificables (115 frames, WebP lossy q80/q73, resolución nativa,
nombres `frame-%03d.webp`):

```bash
# ---- Landscape: 15.2s -> exactamente 115 frames a resolución nativa ----
# fps = N / duración = 115 / 15.2 ≈ 7.566
ffmpeg -i assets/hero-master-landscape.MOV \
  -vf "fps=115/15.2" \
  -c:v libwebp -quality 80 \
  public/sequence/lg/frame-%03d.webp

# ---- Portrait: 13.2s -> 115 frames ----
# fps = 115 / 13.2 ≈ 8.712
ffmpeg -i assets/hero-master-portrait.MOV \
  -vf "fps=115/13.2" \
  -c:v libwebp -quality 73 \
  public/sequence/pt/frame-%03d.webp

# ---- Posters (primer frame como JPG) ----
ffmpeg -i assets/hero-master-landscape.MOV -frames:v 1 -q:v 3 public/hero-poster-lg.jpg
ffmpeg -i assets/hero-master-portrait.MOV  -frames:v 1 -q:v 3 public/hero-poster-pt.jpg

# ---- Fallbacks MP4 ligeros (~3.5 Mbps, H.264, sin audio) ----
ffmpeg -i assets/hero-master-landscape.MOV \
  -c:v libx264 -b:v 3.5M -pix_fmt yuv420p -movflags +faststart -an \
  public/hero-fallback-lg.mp4
ffmpeg -i assets/hero-master-portrait.MOV \
  -c:v libx264 -b:v 3.5M -pix_fmt yuv420p -movflags +faststart -an \
  public/hero-fallback-pt.mp4
```

Reglas de la receta:
- **Elige N frames (~100-120)** y deriva el fps con `N/duración`; NO al revés.
  115 frames dan scrub suave con ~6 MB por set.
- **No escales hacia arriba.** Si el master es 4K, añade `scale=1920:-2`.
- Ajusta `-quality` por set hasta que el TOTAL quede ≤ ~6 MB.
- Nombres `frame-%03d.webp` (el componente asume 3 dígitos, 1-indexado).

## 4. El componente del hero

**Vive en:** `src/components/SequenceHero.tsx` (503 líneas). Config compartida
en `src/lib/media.ts`. Estilos auxiliares en `src/index.css`.

**Dependencias npm:** `gsap` (ScrollTrigger), `react`, y para los CTAs
`lucide-react` (íconos UI). Nada más, no usa framer-motion ni Lenis.

### 4.1 Config (`src/lib/media.ts`)
```ts
export const SEQUENCE_FRAME_COUNT = 115
export const HERO_MEDIA = {
  landscape: { dir: '/sequence/lg', poster: '/hero-poster-lg.jpg', fallback: '/hero-fallback-lg.mp4' },
  portrait:  { dir: '/sequence/pt', poster: '/hero-poster-pt.jpg', fallback: '/hero-fallback-pt.mp4' },
} as const
export function sequenceFrameSrc(dir: string, index: number): string {
  return `${dir}/frame-${String(index + 1).padStart(3, '0')}.webp`
}
```

### 4.2 Scroll: GSAP ScrollTrigger, pin + scrub sobre un proxy
- **NO se anima el canvas directamente.** Se tweena un objeto proxy
  `{ p: 0 } → { p: 1 }` en un timeline con:
  ```ts
  scrollTrigger: {
    trigger: section, start: 'top top',
    end: `+=${portrait ? 4500 : 6000}`,   // runway en px
    pin: true, scrub: 1, anticipatePin: 1,
  }
  ```
- En `onUpdate` del tween: `desired = Math.round(p * (N - 1))` y se llama
  `render()`. `scrub: 1` da 1s de suavizado (catch-up) al scroll.

### 4.3 Pintado en canvas
- `render()` pinta **el frame decodificado más cercano hacia atrás**
  (`while (idx > 0 && !ready[idx]) idx--`): si el frame pedido no llegó, se ve
  el anterior, nunca un hueco. Solo repinta si `idx !== drawn` (dedupe).
- `draw()` implementa **object-cover manual**: `scale = max(cw/iw, ch/ih)`,
  centrado, recorte por overflow.
- Canvas dimensionado a `clientWidth × devicePixelRatio` con **DPR cap 2.5**
  (retina nítido sin pagar 3x en móviles). Al redimensionar se repinta
  `lastDrawnRef` inmediatamente (el resize borra el bitmap).

### 4.4 Precarga (3 oleadas)
1. **El frame del progreso actual** primero (clave al rotar el teléfono a
   mitad de scroll).
2. Los **primeros 25 frames** (`PRIORITY_FRAMES`) en paralelo.
3. El resto con un **pool de 6 workers** (`queue.shift()` en 6 loops async):
   satura la red sin ahogarla.
- Cada `Image` usa `decoding = 'async'`; cuando un frame carga, repinta si
  `i <= desired` (desbloquea lo que el scroll pide).

### 4.5 Orientación landscape/portrait
- Estado `orientation` derivado de `window.innerWidth > window.innerHeight`
  (listener de `resize`). Cambiarlo **re-ejecuta el efecto completo** (está en
  las deps del `useEffect`): mata timeline/ScrollTrigger y reconstruye con el
  otro set de frames, otro runway y otros beats.
- Durante el swap, `lastDrawnRef` (ref que sobrevive al rebuild) mantiene el
  último frame de la orientación anterior pintado → **no hay flash negro**.
- El intro del eyebrow solo se reproduce si `progress < 0.02` (un flip a mitad
  de scroll no lo repite).

## 5. Beats de texto → progreso normalizado del pin

Cinco beats como capas absolutas full-viewport, animados **en el mismo timeline**
del scrub (autoAlpha + y + blur 6px; salida inversa antes del siguiente beat,
nunca hay dos visibles). Los rangos son **por orientación** porque los masters
duran distinto y los momentos del footage caen en % distintos (mapeados
frame-por-frame):

| Beat | Contenido | Landscape (in→out) | Portrait (in→out) |
|---|---|---|---|
| b0 | Eyebrow "Luxury watch curation" (el logo del footage ES el título) | load → 0.06 | load → 0.06 |
| b2 | "Inspected to the last component." | 0.46 → 0.535 | 0.43 → 0.50 |
| b3 | "Verified to the last detail." | 0.575 → 0.65 | 0.545 → 0.61 |
| b4 | "Assembled into legacy." | 0.69 → 0.755 | 0.655 → 0.71 |
| b5 | Clímax: H1 "Turning Time / into Legacy." + "Buy. Sell. Trade." + CTAs | **0.80** → se queda | **0.75** → se queda |

- El clímax entra **exactamente cuando arranca la explosión** en cada footage
  (~0.81 lg, ~0.75 pt).
- Cada beat lleva **micro-parallax** (`yPercent 5 → -5` durante su ventana,
  ~0.9x del scroll) vía el helper `drift()`.
- Posicionamiento: en landscape los one-liners alternan izquierda/derecha en el
  espacio negativo lateral (`left-[6vw] top-[30%] max-w-[34vw]`, etc.);
  en portrait van centrados a ~78% de altura bajo el reloj.
- Legibilidad sobre footage brillante (clases en `index.css`):
  - `.beat-scrim`: vignette radial local difuminada detrás del texto (pseudo
    ::before, no una caja).
  - `.text-legible`: text-shadow doble (halo suave + sombra de contacto).
  - `.gold-glow`: brightness 1.07 + drop-shadows para separar el degradado
    dorado del movimiento dorado del reloj (drop-shadow y no text-shadow
    porque el texto con background-clip es transparente).

## 6. Runway y montaje del sticky

- **No usa `position: sticky`**: usa el **pin de ScrollTrigger** (`pin: true`),
  que fija la sección y crea el espaciador automáticamente.
- Runway: `end: '+=6000'` px en desktop, `+=4500` en portrait/móvil
  (constantes `PIN_DESKTOP` / `PIN_MOBILE`). Regla práctica: ~400 px de scroll
  por segundo de footage.
- La sección es `relative min-h-[100dvh] overflow-hidden` (100dvh, no
  `h-screen`, por la barra de iOS Safari).
- Después del hero hay un **sentinel** de 1px en `App.tsx`; al cruzar el 60% del
  viewport revela la Nav (oculta durante todo el pin) y esconde el ScrollCue
  persistente vía el callback `onCueHide` cuando `p >= climax - 0.05` (para no
  duplicar el CTA "View collection" del clímax).

## 7. Fallbacks (3 niveles)

1. **`prefers-reduced-motion`**: sin canvas, sin pin, sin scrub. Se muestra el
   **último frame** como `<img>` estático + el bloque de clímax completo (H1 +
   CTAs). La Nav se revela de inmediato.
2. **Error de carga de la secuencia**: si el **frame 0** dispara `onerror`, se
   activa `videoFallback` → se oculta el canvas y se scrubbea un `<video>` MP4
   ligero (`video.currentTime = p * duration` en el mismo onUpdate). Poster
   JPG mientras carga. `preload="none"` (solo descarga si hace falta).
3. **Conexión lenta / LCP**: un `<img>` del **frame 1 con `fetchPriority="high"`**
   pinta debajo del canvas desde el primer paint (es el LCP); el canvas toma el
   relevo cuando decodifica. Y si el scroll va más rápido que la red, el
   renderer pinta "el frame más cercano listo" (§4.3): se ve un scrub más
   grueso, nunca negro.

## 8. Problemas encontrados y soluciones (de commits + comentarios)

| Problema | Solución |
|---|---|
| Titular serif recortado (descendentes de "Legacy" + background-clip dorado) | `leading` ≥1.1 + `pb-[0.15em]` reservado en la línea itálica |
| Texto ilegible sobre las partes brillantes/doradas del reloj | Sistema de 3 clases: `beat-scrim` (vignette local), `text-legible` (sombras), `gold-glow` (brightness + drop-shadow) |
| Flash negro al girar el dispositivo (rebuild de la secuencia) | `lastDrawnRef` sobrevive al rebuild y se repinta; el frame equivalente de la otra orientación se precarga PRIMERO |
| El intro del eyebrow se re-reproducía al girar a mitad de scroll | Solo se lanza si `scrollTrigger.progress < 0.02` |
| ScrollCue fijo duplicaba el CTA del clímax | `onCueHide(p >= b5In - 0.05)` lo desvanece justo antes |
| El clímax no coincidía con la explosión en portrait (masters de distinta duración) | Mapa `BEATS` por orientación, verificado frame a frame (0.80 lg / 0.75 pt) |
| Canvas borroso en retina, o carísimo en móviles 3x | `dpr = min(devicePixelRatio, 2.5)` |
| Scroll más rápido que la red → frames sin decodificar | Render "nearest-earlier-ready" + precarga en 3 oleadas con pool de 6 |
| Resize borra el bitmap del canvas | Repintar `lastDrawnRef` dentro de `sizeCanvas()` |
| Subline del clímax pegada a los descendentes del H1 | Espaciado del bloque clímax corregido (mt-7 / pb-[0.15em]) |
| StrictMode / React 18 doble-mount duplicando pins | Cleanup explícito: `tl.scrollTrigger?.kill(); tl.kill()` + flag `disposed` en las cargas |

## 9. Checklist para replicar en otro proyecto

1. Consigue UN master por orientación con la narrativa ya editada (10-16 s).
2. Extrae ~115 frames WebP por set con los comandos de §3 (total ≤ 6 MB/set).
3. Genera poster JPG + fallback MP4 (~3.5 Mbps) por orientación.
4. Copia `SequenceHero.tsx`, `media.ts` (ajusta rutas/`SEQUENCE_FRAME_COUNT`),
   y las clases CSS `beat-scrim` / `text-legible` / `gold-glow` / `.cta-*`.
5. `npm i gsap` y registra ScrollTrigger.
6. Mira tu footage y **remapea `BEATS`** a los momentos reales (frame ≈
   `p * 114`); el clímax debe entrar en el evento visual más fuerte.
7. Ajusta `PIN_DESKTOP`/`PIN_MOBILE` (~400 px por segundo de footage).
8. Verifica los 3 fallbacks: OS con reduced-motion, red bloqueada (DevTools
   offline tras el primer paint), y throttling 3G.

---

*Fuentes: `src/components/SequenceHero.tsx`, `src/lib/media.ts`, `src/App.tsx`,
`src/components/ScrollCue.tsx`, `src/index.css`, binarios en `public/sequence/`
y `assets/`, mensajes de commit `e49b4b6` y `f4029ba`.*
