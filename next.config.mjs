// next.config.mjs
import withTM from 'next-transpile-modules';

const withTranspileModules = withTM([
  '@mui/material',
  '@mui/system',
  '@mui/icons-material',
  '@mui/x-date-pickers',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withTranspileModules(nextConfig);
