export const metadata = {
  title: 'AGAFARI API',
  description: 'AGAFARI wedding platform — backend service',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
