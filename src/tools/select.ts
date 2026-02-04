import mask from "json-mask";

export function applySelect<T>(data: T, select: string | undefined): T {
  if (!select) return data;
  return mask(data, select) as T;
}
