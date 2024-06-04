import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import 'react-tippy/dist/tippy.css'
import ContextProvider from "@/context/context";

const GetUserData = dynamic(() => import("../components/getUserData"), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ContextProvider>
          <GetUserData></GetUserData>
          <ToastContainer limit={4}/>
          <Navbar></Navbar>
          <div className="base mb-auto">
            {children}
          </div>
          <Footer></Footer>
        </ContextProvider>
      </body>
    </html>
  );
}