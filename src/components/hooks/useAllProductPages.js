import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { formatProductRecord } from "./useProductData";

export const useAllProductPages = (
  initialProducts,
  pageInfo,
  baseCurrency,
  deps = []
) => {
  const { get } = useApi();
  const [allProducts, setAllProducts] = useState(initialProducts || []);
  const [loadingAllProducts, setLoadingAllProducts] = useState(false);
  const [isComplete, setIsComplete] = useState(!pageInfo?.next);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    setAllProducts(initialProducts || []);
    setIsComplete(!pageInfo?.next);
    setError(null);

    const fetchRemainingPages = async () => {
      if (!pageInfo?.next) return;

      setLoadingAllProducts(true);
      let aggregated = [...(initialProducts || [])];
      let nextUrl = pageInfo.next;

      try {
        while (nextUrl && !isCancelled) {
          const pageData = await get(nextUrl, false);
          const results = Array.isArray(pageData)
            ? pageData
            : pageData?.results || [];
          const formatted = results.map((product) =>
            formatProductRecord(product, baseCurrency)
          );
          aggregated = aggregated.concat(formatted);
          nextUrl = Array.isArray(pageData) ? null : pageData?.next;
        }

        if (!isCancelled) {
          setAllProducts(aggregated);
          setIsComplete(true);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to fetch remaining product pages:", err);
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoadingAllProducts(false);
        }
      }
    };

    fetchRemainingPages();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo?.next, baseCurrency, ...deps, initialProducts]);

  return {
    allProducts,
    loadingAllProducts,
    isComplete,
    error,
  };
};
