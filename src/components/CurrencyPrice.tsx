'use client';
export function CurrencyPrice({usd}:{usd:number}){return <div><strong>{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(usd)}</strong><small style={{display:'block',color:'#667085'}}>Prices and checkout are in USD.</small></div>}
