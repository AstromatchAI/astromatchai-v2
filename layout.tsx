import './globals.css';

export const metadata = {
  title: 'AstroMatchAI',
  description: 'Cosmic soulmate compatibility powered by astrology and AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
