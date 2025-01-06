import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/app/AppProvider";
import { cookies } from "next/headers";
import { ToastContainer } from "react-toastify";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Next App Project",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider initialSessionToken={sessionToken?.value}>
          {children}
        </AppProvider>
        <ToastContainer position="bottom-right" autoClose={5000} />
        <Toaster />
      </body>
    </html>
  );
}
