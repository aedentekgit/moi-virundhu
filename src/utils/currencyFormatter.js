/**
 * Formats a number into Indian Currency Format (e.g. ₹ 1,25,000)
 * @param {number|string} amount 
 * @param {boolean} includeSymbol 
 * @returns {string}
 */
export const formatIndianCurrency = (amount, includeSymbol = true) => {
  const num = Number(amount) || 0;
  
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'decimal'
  });

  return includeSymbol ? `₹ ${formatted}` : formatted;
};

/**
 * Returns formatted currency or masked string if hidden
 */
export const formatAmountOrMask = (amount, isHidden, includeSymbol = true) => {
  if (isHidden) {
    return includeSymbol ? '₹ ••••••' : '••••••';
  }
  return formatIndianCurrency(amount, includeSymbol);
};
