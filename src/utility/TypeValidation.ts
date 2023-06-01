export const isValidKey = (key: unknown): key is string | number => {
  return typeof key === "string" || typeof key === "number";
};
