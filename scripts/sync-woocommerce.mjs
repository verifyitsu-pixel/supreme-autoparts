import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const base=(process.env.WOOCOMMERCE_STORE_URL||'').replace(/\/$/,'');
const key=process.env.WOOCOMMERCE_CONSUMER_KEY||'';
const secret=process.env.WOOCOMMERCE_CONSUMER_SECRET||'';
if(!base||!key.startsWith('ck_')||!secret.startsWith('cs_'))throw new Error('Set WOOCOMMERCE_STORE_URL, WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET.');
const auth=`Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;
async function list(endpoint){const items=[];for(let page=1;;page++){const response=await fetch(`${base}/wp-json/wc/v3/${endpoint}?per_page=100&page=${page}`,{headers:{Authorization:auth,Accept:'application/json'}});if(!response.ok)throw new Error(`${endpoint} page ${page}: ${response.status} ${await response.text()}`);const batch=await response.json();items.push(...batch);if(page>=Number(response.headers.get('x-wp-totalpages')||1))break;}return items;}
const [products,categories]=await Promise.all([list('products'),list('products/categories')]);
const normalized=products.map(product=>({id:product.id,name:product.name,slug:product.slug,sku:product.sku||'',type:product.type,status:product.status,priceUsd:product.price?Number(product.price):null,regularPriceUsd:product.regular_price?Number(product.regular_price):null,salePriceUsd:product.sale_price?Number(product.sale_price):null,stockStatus:product.stock_status,stockQuantity:product.stock_quantity,description:product.description||'',shortDescription:product.short_description||'',categories:(product.categories||[]).map(category=>category.name),images:(product.images||[]).map(image=>({id:image.id,src:image.src,alt:image.alt||product.name})),attributes:product.attributes||[],variations:product.variations||[],permalink:product.permalink,dateModified:product.date_modified_gmt}));
await mkdir(path.resolve('src/data'),{recursive:true});
await writeFile(path.resolve('src/data/woocommerce-products.json'),JSON.stringify(normalized,null,2)+'\n','utf8');
await writeFile(path.resolve('src/data/woocommerce-categories.json'),JSON.stringify(categories,null,2)+'\n','utf8');
console.log(`Imported ${normalized.length} products and ${categories.length} categories from WooCommerce.`);
