export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ fontFamily: "sans-serif" }}>
        <h1>React2Shell POC</h1>
        {children}
      </body>
    </html>
  );
}
