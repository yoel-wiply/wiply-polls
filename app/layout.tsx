import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Header from "./../public/Header.png";
import PoweredBy from "./../public/PoweredBy.png";

const inter = Inter({ subsets: ["latin"] });

const openGraphImage = {
  title: "מערכת הסקרים החכמה של וויפלי",
  cta: "Generated by Wiply",
};

export const metadata: Metadata = {
  title: "מערכת הסקרים החכמה של וויפלי",
  description: "Generated by Wiply",
  openGraph: {
    images: [`/api/og?${new URLSearchParams(openGraphImage)}`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="he">
      <body className={inter.className}>
        <div className="flex justify-center">
        <div className="absolute w-full top-0 p-4 flex flex-col items-center">
            <Image
              src={Header}
              alt=""
              style={{
                // position: "absolute",
                // top: 0,
                // padding: "1rem",
                maxWidth: 200,
              }}
            />
          </div>

      <main className=" w-screen md:w-2/3 xl:w-1/2 pb-48">
            {/* <div
              className="relative bg-white w-full h-full rounded-xl shadow-xl md:h-auto p-8 z-10"
              style={{
                background: "rgba( 255, 255, 255, 0.75 );",
                boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 8.5px)",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
              }}
            > */}
            {children}
            {/* </div> */}
          </main> 
          
          <div className="absolute w-full bottom-0 flex flex-col items-center">
            {/* <Footer /> */}

            
            <Image
              src={PoweredBy}
              alt="PoweredBy"
              style={{}}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
