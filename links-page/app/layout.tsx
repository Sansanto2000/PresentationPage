import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import profile from "./data/profile.json";
import "./styles/tokens.css";
import "./styles/globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});

const TITLE = `${profile.name} · Enlaces`;
const DESCRIPTION = "Perfiles académicos, repositorios y formas de contacto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/favicon.ico" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "profile", locale: "es_AR" },
};

export const viewport: Viewport = {
  // Mismo valor que `--color-bg-deep`: la barra del navegador continúa el fondo.
  themeColor: "#14121f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={lato.variable}>
      <body>{children}</body>
    </html>
  );
}
