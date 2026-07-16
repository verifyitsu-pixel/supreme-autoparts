const base=(process.argv[2]||'https://www.supremeautoparts.co.ke').replace(/\/$/,'');
async function count(endpoint){const response=await fetch(`${base}/wp-json/wc/store/v1/${endpoint}?per_page=1`);if(!response.ok)throw new Error(`${endpoint}: ${response.status}`);return Number(response.headers.get('x-wp-total')||0)}
console.log(JSON.stringify({publishedProducts:await count('products'),publishedCategories:await count('products/categories')},null,2));
