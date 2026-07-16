import type { NextConfig } from 'next';
import path from 'node:path';
const config: NextConfig = { experimental: { optimizePackageImports: ['lucide-react'], webpackBuildWorker: false }, webpack(config){config.resolve.alias['@']=path.resolve(process.cwd(),'src');config.cache=false;return config}, async redirects(){return ['track-order','submit-ticket','make-payment','testimonials','faq','blog'].map(path=>({source:`/${path}`,destination:`/resources/${path}`,permanent:true}))} };
export default config;
