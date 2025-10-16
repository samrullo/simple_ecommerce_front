const joinValues = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return value;
};

/**
 * Normalizes various API error response formats into a readable message.
 * @param {any} error - Error thrown by axios/fetch or a plain object/string.
 * @param {string} fallback - Message to use when no detail is available.
 * @returns {string} - Human-friendly error message.
 */
const extractApiErrorMessage = (error, fallback = "Request failed.") => {
  if (!error) {
    return fallback;
  }

  const data = error?.response?.data ?? error?.data ?? error;

  if (!data) {
    return error?.message || fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  const prioritizedKeys = ["error", "detail", "message", "non_field_errors"];
  for (const key of prioritizedKeys) {
    if (data[key]) {
      const normalized = joinValues(data[key]);
      if (normalized) {
        return normalized;
      }
    }
  }

  const firstValue = joinValues(Object.values(data).find(Boolean));
  return firstValue || error?.message || fallback;
};

export default extractApiErrorMessage;
