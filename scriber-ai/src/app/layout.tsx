import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scriber AI | Build a Resume That Lands Your Dream Job in 15 Minutes",
  description: "Build a professional, ATS-optimized resume in minutes with AI-powered suggestions. Recruiter-approved templates that help you land 3x more interviews. Free to start.",
  keywords: ["resume builder", "AI resume", "ATS resume", "resume templates", "job application", "career", "professional resume", "resume maker", "CV builder"],
  openGraph: {
    title: "Scriber AI | Build a Resume That Lands Your Dream Job",
    description: "Build a professional, ATS-optimized resume in minutes with AI-powered suggestions. Recruiter-approved templates that help you land 3x more interviews.",
    url: "https://scriber.ai",
    siteName: "Scriber AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scriber AI | Build a Resume That Lands Your Dream Job",
    description: "Build a professional, ATS-optimized resume in minutes with AI-powered suggestions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://scriber.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
