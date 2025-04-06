import Header from "./components/Header/ui";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
