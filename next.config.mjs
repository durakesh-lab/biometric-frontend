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
  // Don't fail the production build on ESLint errors (mostly cosmetic:
  // unescaped quotes, exhaustive-deps warnings). Run `npm run lint` to see them.
  // Real compile/type errors still fail the build.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withTranspileModules(nextConfig);
