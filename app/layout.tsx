import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Humsafar Forever Love - Premium Pakistani Matrimonial Service',
  description: 'Find your perfect life partner with Humsafar Forever Love. Pakistan\'s most trusted matrimonial platform connecting hearts across the globe. Join thousands of success stories.',
  keywords: 'Pakistani matrimonial, marriage bureau, rishta, shaadi, Pakistani brides, Pakistani grooms, Muslim matrimony, online marriage, life partner',
  authors: [{ name: 'Humsafar Forever Love' }],
  creator: 'Humsafar Forever Love',
  publisher: 'Humsafar Forever Love',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://humsafarforeverlove.com',
    siteName: 'Humsafar Forever Love',
    title: 'Humsafar Forever Love - Premium Pakistani Matrimonial Service',
    description: 'Find your perfect life partner with Humsafar Forever Love. Pakistan\'s most trusted matrimonial platform connecting hearts across the globe.',
    images: [
      {
        url: '/humsafar-logo.png',
        width: 1200,
        height: 630,
        alt: 'Humsafar Forever Love - Pakistani Matrimonial Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humsafar Forever Love - Premium Pakistani Matrimonial Service',
    description: 'Find your perfect life partner with Humsafar Forever Love. Pakistan\'s most trusted matrimonial platform.',
    images: ['/humsafar-logo.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com',
  },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Humsafar Forever Love",
              "url": "https://humsafarforeverlove.com",
              "logo": "https://humsafarforeverlove.com/humsafar-logo.png",
              "description": "Pakistan's most trusted matrimonial platform connecting hearts across the globe",
              "sameAs": [
                "https://www.facebook.com/humsafarforeverlove",
                "https://www.instagram.com/humsafarforeverlove"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "areaServed": "PK",
                "availableLanguage": ["English", "Urdu"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK"
              }
            })
          }}
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
