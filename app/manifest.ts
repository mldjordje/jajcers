import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jajce.rs',
    short_name: 'Jajce',
    description: 'Sveza jaja direktno sa farme.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f4c81',
    icons: [
      {
        src: '/img/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/img/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
