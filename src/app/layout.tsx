import "@/styles/globals.css";

import { type Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { DuckDBProvider } from "@/contexts/DuckDBContext";

const baseUrl =
  process.env.BASE_URL ?? "https://google-myactivity-visualization.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "ActViz",
  description: "Visualize your Google activity.",
  robots: {
    index: true,
  },
  icons: [{ rel: "icon", url: "/icon/48" }],
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={geist.className}>
        <TRPCReactProvider>
          <DuckDBProvider>{children}</DuckDBProvider>
        </TRPCReactProvider>
        {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
      </body>
    </html>
  );
}
