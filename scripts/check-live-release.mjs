const base=(process.argv[2]||'https://www.supremeautoparts.co.ke').replace(/\/$/,'');
const productsResponse=await fetch(`${base}/wp-json/wc/store/v1/products?search=${encodeURIComponent('Acura ABS Control Module')}&per_page=5`);
const products=await productsResponse.json();
const sample=products.find(product=>/Acura ABS Control Module/i.test(product.name))||products[0];
const report={sample:sample?{id:sample.id,name:sample.name,price:sample.prices?.price,currency:sample.prices?.currency_code,isPurchasable:sample.is_purchasable,addToCart:sample.add_to_cart?.text}:null};
console.log(JSON.stringify(report,null,2));
if(!sample||!sample.is_purchasable||!sample.prices?.price)process.exit(1);
