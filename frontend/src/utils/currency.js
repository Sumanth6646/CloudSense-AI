const CURRENCY_CONFIG = {
  USD: {
    symbol: "$",
    rate: 1,
  },

  INR: {
    symbol: "₹",
    rate: 95,
  },

  GBP: {
    symbol: "£",
    rate: 0.79,
  },

  EUR: {
    symbol: "€",
    rate: 0.92,
  },
};

export function getCurrency() {
  const savedCurrency =
    localStorage.getItem("cloudsense_currency");

  if (
    savedCurrency &&
    Object.prototype.hasOwnProperty.call(
      CURRENCY_CONFIG,
      savedCurrency
    )
  ) {
    return savedCurrency;
  }

  return "USD";
}

export function convertCurrency(
  value,
  currency = getCurrency()
) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 0;
  }

  const config =
    CURRENCY_CONFIG[currency] ||
    CURRENCY_CONFIG.USD;

  return amount * config.rate;
}

export function formatCurrency(
  value,
  currency = getCurrency(),
  options = {}
) {
  const amount = convertCurrency(
    value,
    currency
  );

  const config =
    CURRENCY_CONFIG[currency] ||
    CURRENCY_CONFIG.USD;

  /*
   * Always use valid integer fraction values.
   * This prevents:
   * RangeError: maximumFractionDigits value is out of range
   */

  const requestedMinimum =
    Number.isInteger(
      options?.minimumFractionDigits
    )
      ? options.minimumFractionDigits
      : 2;

  const requestedMaximum =
    Number.isInteger(
      options?.maximumFractionDigits
    )
      ? options.maximumFractionDigits
      : 2;

  const minimumFractionDigits = Math.max(
    0,
    Math.min(20, requestedMinimum)
  );

  const maximumFractionDigits = Math.max(
    minimumFractionDigits,
    Math.min(20, requestedMaximum)
  );

  return (
    config.symbol +
    amount.toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits,
    })
  );
}

export function getCurrencySymbol(
  currency = getCurrency()
) {
  return (
    CURRENCY_CONFIG[currency]?.symbol ||
    "$"
  );
}