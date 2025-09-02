const repo = 'Portfolio';
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // <<-- SE COMENTA ESTA LÍNEA PARA EL DESARROLLO LOCAL
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;