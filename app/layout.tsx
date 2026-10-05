import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FríoMar · Cadena de frío pesquera",
  description:
    "Prototipo navegable del sistema de inventario y cadena de frío para comerciantes de pescado de Necoclí y Turbo. Ingeniería de Software II — Jean Londoño.",
};

export const viewport: Viewport = {
  themeColor: "#0f6292",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
