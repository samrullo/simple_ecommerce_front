import { useCallback, useEffect, useState } from "react";
import { ACTIVE_FXRATES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useApi } from "./useApi";

export const useFxRates = (deps = []) => {
  const { get } = useApi();
  const [fxRates, setFxRates] = useState([]);
  const [loadingFxRates, setLoadingFxRates] = useState(true);

  useEffect(() => {
    const fetchFxRates = async () => {
      setLoadingFxRates(true);
      try {
        const rates = await get(ACTIVE_FXRATES_ENDPOINT, false);
        setFxRates(
          (rates || []).map((rate) => ({
            currency_from: rate.currency_from.code,
            currency_to: rate.currency_to.code,
            rate: Number(rate.rate),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch FX rates:", error);
        setFxRates([]);
      } finally {
        setLoadingFxRates(false);
      }
    };

    fetchFxRates();
  }, [...deps]);

  const convert_amount_from_one_currency_to_another = useCallback(
    (amount, currencyFrom, currencyTo) => {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount)) return null;
      if (!currencyFrom || !currencyTo) return null;
      if (currencyFrom === currencyTo) return numericAmount;

      const directRate = fxRates.find(
        (rate) =>
          rate.currency_from === currencyFrom && rate.currency_to === currencyTo
      );
      if (directRate?.rate) {
        return numericAmount * directRate.rate;
      }

      const inverseRate = fxRates.find(
        (rate) =>
          rate.currency_from === currencyTo && rate.currency_to === currencyFrom
      );
      if (inverseRate?.rate) {
        return numericAmount / inverseRate.rate;
      }

      return null;
    },
    [fxRates]
  );

  return {
    fxRates,
    loadingFxRates,
    convert_amount_from_one_currency_to_another,
  };
};
