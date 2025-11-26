

export const formatCurrencyWithText = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return "0 rupees";
  }
  
  return `${amount.toLocaleString('en-IN')} rupees`;
};
