async function syncProduct(product) {
  // Random delay 400-1200ms
  const delay = Math.random() * 800 + 400;
  await new Promise(resolve => setTimeout(resolve, delay));
  // Failure rate 10%
  if (Math.random() < 0.1) {
    return { success: false, error: 'woocommerce_rest_product_invalid_sku' };
  }
  if (product.wcProductId) {
    return { success: true, id: product.wcProductId };
  } else {
    const id = Math.floor(Math.random() * 90000) + 10000;
    return { success: true, id };
  }
}

module.exports = { syncProduct };