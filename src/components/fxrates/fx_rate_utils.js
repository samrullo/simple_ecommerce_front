export const applyFXRate = (fxRates, amount, from_currency, to_currency) => {
    if (!amount) return "";
    if (from_currency === to_currency) return amount;
    const fx = fxRates.find(fx => fx.currency_from === from_currency && fx.currency_to === to_currency);
    return fx ? amount * fx.rate : amount;
};
