export function productImage(productImageUrl?: string, variantImage?: string) {
  return variantImage || productImageUrl;
}
