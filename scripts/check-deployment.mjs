const url=process.argv[2]||'https://www.supremeautoparts.co.ke/';
const response=await fetch(url,{redirect:'follow'});
const html=await response.text();
console.log(JSON.stringify({url:response.url,status:response.status,server:response.headers.get('server'),poweredBy:response.headers.get('x-powered-by'),isSupremeBuild:html.includes('SUPREME')||html.includes('Supreme Autoparts'),isNext:html.includes('/_next/')},null,2));
if(!response.ok)process.exit(1);
