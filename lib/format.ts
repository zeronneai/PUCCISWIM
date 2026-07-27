export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// cents -> "$45.00"
export function formatCents(cents: number): string {
  return formatUSD(cents / 100);
}
