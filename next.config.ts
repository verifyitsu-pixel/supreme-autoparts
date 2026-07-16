import type {NextConfig} from 'next';import path from 'node:path';
const config:NextConfig={experimental:{optimizePackageImports:['lucide-react'],webpackBuildWorker:false},webpack(config){config.resolve.alias['@']=path.resolve(process.cwd(),'src');config.cache=false;return config},async redirects(){return[
{source:'/used-auto-parts/:slug',destination:'/make/:slug',permanent:true},
{source:'/parts/:category/:part',destination:'/products/:part',permanent:true},
{source:'/account/Testimonials',destination:'/resources/testimonials',permanent:true},
{source:'/account/shipping-payment-policy',destination:'/shipping-payment-policy',permanent:true},
{source:'/account/warranty-and-return',destination:'/warranty-and-return',permanent:true},
{source:'/account/privacy-policy',destination:'/privacy-policy',permanent:true},
{source:'/account/cookie-policy',destination:'/cookie-policy',permanent:true},
{source:'/account/track-order',destination:'/resources/track-order',permanent:true},
{source:'/account/submit-ticket',destination:'/resources/submit-ticket',permanent:true},
{source:'/account/payment-details',destination:'/resources/make-payment',permanent:true},
{source:'/account/faq',destination:'/resources/faq',permanent:true},
{source:'/blog/blog-listing',destination:'/resources/blog',permanent:true},
{source:'/blog/blog-details',destination:'/resources/blog',permanent:true},
...['track-order','submit-ticket','make-payment','testimonials','faq','blog'].map(item=>({source:`/${item}`,destination:`/resources/${item}`,permanent:true}))]}};
export default config;
