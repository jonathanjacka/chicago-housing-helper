import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chicago Housing Helper | Find Affordable Housing Programs',
  description:
    'Free tool to discover subsidized housing programs you qualify for in Chicago. Based on official CHA data.',
  keywords: [
    'Chicago housing',
    'affordable housing',
    'Section 8',
    'CHA',
    'housing assistance',
    'rent help',
    'subsidized housing',
  ],
  openGraph: {
    title: 'Chicago Housing Helper',
    description: 'Find affordable housing programs you qualify for in Chicago',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
