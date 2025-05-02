import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'F-MOC',
    short_name: 'F-MOC',
    description: 'A Progressive Web App for Field Maintenance Operation Cost',
    start_url: '/login',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/public/images/FMOC-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/public/images/FMOC-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}