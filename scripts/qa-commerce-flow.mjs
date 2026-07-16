const base=(process.argv[2]||'https://www.supremeautoparts.co.ke').replace(/\/$/,'');
let cookies='';
async function request(url,options={}){
  const response=await fetch(url,{redirect:'manual',...options,headers:{...(options.headers||{}),Cookie:cookies}});
  const jar=new Map(cookies.split('; ').filter(Boolean).map(item=>{const at=item.indexOf('=');return [item.slice(0,at),item.slice(at+1)]}));
  for(const raw of response.headers.getSetCookie?.()||[]){const item=raw.split(';')[0],at=item.indexOf('=');jar.set(item.slice(0,at),item.slice(at+1))}
  cookies=[...jar].map(([key,value])=>`${key}=${value}`).join('; ');
  return response;
}
const product=await fetch(`${base}/wp-json/wc/store/v1/products/32`).then(async response=>{if(!response.ok)throw new Error(`Product API ${response.status}`);return response.json()});
const productResponse=await request(product.permalink),productHtml=await productResponse.text();
const hasFitmentFields=/fitment_year/.test(productHtml)&&/fitment_make/.test(productHtml)&&/fitment_model/.test(productHtml);
const body=new URLSearchParams({'add-to-cart':String(product.id),quantity:'1',fitment_year:'2020',fitment_make:'Toyota',fitment_model:'Corolla',fitment_vin:'JTDBR32E720123456'});
const add=await request(product.permalink,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
const addHtml=await add.text();
const cookiesAfterAdd=cookies.split('; ').filter(Boolean).map(item=>item.slice(0,item.indexOf('=')));
if(add.status>=300&&add.status<400&&add.headers.get('location'))await request(new URL(add.headers.get('location'),base));
const cart=await request(`${base}/cart/`),cartHtml=await cart.text();
const storeCart=await request(`${base}/wp-json/wc/store/v1/cart`),storeCartJson=await storeCart.json();
const checkout=await request(`${base}/checkout/`),checkoutHtml=await checkout.text();
const notice=(addHtml.match(/(?:woocommerce-error|woocommerce-message)[^>]*>([\s\S]*?)<\/[^>]+>/i)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const storeCartItems=storeCartJson.items?.map(item=>({id:item.id,name:item.name,quantity:item.quantity}))||[];
const policyLinks={terms:/terms-and-conditions/.test(checkoutHtml),privacy:/privacy-policy/.test(checkoutHtml),refundChargeback:/refund-and-chargeback-policy/.test(checkoutHtml),shipping:/shipping-payment-policy/.test(checkoutHtml),warranty:/warranty-and-return/.test(checkoutHtml)};
const report={product:{id:product.id,name:product.name,permalink:product.permalink,isPurchasable:product.is_purchasable,isInStock:product.is_in_stock,price:product.prices?.price,currency:product.prices?.currency_code},productStatus:productResponse.status,hasFitmentFields,addStatus:add.status,addNotice:notice||null,cookiesAfterAdd,hasWooCookie:/woocommerce_items_in_cart|wp_woocommerce_session/.test(cookies),cartStatus:cart.status,cartCache:cart.headers.get('x-cache')||cart.headers.get('cf-cache-status')||cart.headers.get('cache-control'),cartContainsProduct:cartHtml.includes(product.name)||storeCartItems.some(item=>item.id===product.id),cartEmptyHtml:/cart is currently empty|wc-block-cart__empty-cart/i.test(cartHtml),storeCartStatus:storeCart.status,storeCartItems,cartHasCheckoutLink:/checkout/i.test(cartHtml),checkoutStatus:checkout.status,checkoutHasForm:/checkout|billing_/i.test(checkoutHtml),checkoutMentionsUSD:/USD|US Dollar|&#36;|\$/.test(checkoutHtml),policyLinks,requiredConsent:/supreme_policy_accept/.test(checkoutHtml)};
console.log(JSON.stringify(report,null,2));
if(!report.hasFitmentFields||!report.cartContainsProduct||!report.checkoutHasForm||Object.values(policyLinks).some(value=>!value)||!report.requiredConsent)process.exit(1);
