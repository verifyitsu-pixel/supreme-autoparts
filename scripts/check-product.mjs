const base = (process.argv[2] || 'https://www.supremeautoparts.co.ke').replace(/\/$/, '');
const id = process.argv[3] || '32';
const response = await fetch(`${base}/wp-json/wc/store/v1/products/${id}`);
if (!response.ok) throw new Error(`Product API returned ${response.status}`);
const product = await response.json();
console.log(JSON.stringify({
  id: product.id,
  name: product.name,
  permalink: product.permalink,
  isPurchasable: product.is_purchasable,
  isInStock: product.is_in_stock,
  price: product.prices?.price,
  currency: product.prices?.currency_code,
  addToCart: product.add_to_cart,
}, null, 2));
