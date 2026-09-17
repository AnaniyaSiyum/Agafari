export const metadata = {
  title: "Agafari",
  description: "Digital event management for Ethiopian weddings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
