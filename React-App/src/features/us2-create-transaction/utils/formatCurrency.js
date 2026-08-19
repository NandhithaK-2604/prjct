// Formats a numeric amount as INR with Indian digit grouping (e.g. 1,23,456.00)
// Extend this if you later need multi-currency support (US3/US6 territory).
export function formatCurrency(amount, currency = 'INR') {
  const value = Number(amount);
  if (Number.isNaN(value)) return '';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
