import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Article Publishing & SEO Automation | AI-Powered SEO Analysis",
  description:
    "Submit articles and get instant AI-generated SEO keywords, meta tags, and ranking insights. Powered by n8n workflows and OpenAI.",
  keywords: "SEO automation, article publishing, AI SEO, keyword analysis, meta tags, n8n workflow",
  openGraph: {
    title: "Article Publishing & SEO Automation",
    description: "Submit articles and get instant AI-generated SEO insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
