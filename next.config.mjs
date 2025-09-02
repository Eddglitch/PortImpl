/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Exporta a HTML, CSS, y JS estáticos
  basePath: '/PortImpl', // Asegúrate de que esto coincida con el nombre de tu repositorio
  assetPrefix: '/PortImpl/', // Prefijo para todos los assets (CSS, JS, imágenes)
  images: {
    unoptimized: true, // Deshabilita la optimización de imágenes de Next.js para exportación estática
  },
};

export default nextConfig;