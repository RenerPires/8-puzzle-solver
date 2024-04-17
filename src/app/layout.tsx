import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSwitch } from "@/components/theme/theme-switch";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "8 puzzle solver",
  description: "8 puzzle solver using A*, Deep-Search and Wide-Search algorithms and using JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/8puzzle.svg" type="image/svg+xml" />
      </head>
      <body className={`cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          fontSans.variable
        )`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed right-8 top-8">
              <ThemeSwitch />
            </div>
            {children}
            </ThemeProvider></body>
    </html>
  );
}
