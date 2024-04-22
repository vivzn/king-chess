"use client";

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { auth as authFB } from "@/firebase";
import Loading from "@/components/loading";
import axios from "axios";
import { Nav } from "@/components/nav";

const RootContext = createContext<any>("");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [user, setUser] = useState<any>(null)
  const [load, setLoad] = useState<boolean>(true)

  const router = useRouter();

  useEffect(() => {
    const auth = authFB;
    const listen = onAuthStateChanged(auth, (user_) => {
      if (user_) {

        setLoad(true);
        console.log("USER", user_?.email);
        axios.post('/api/get-user', { email: user_?.email }).then((data: any) => {

          if (data?.data) {
            setUser(data?.data)
            if (window.location.href === "/") {
              router.refresh();
            }
            // console.log("AUhj")
            setLoad(false)
          } else {
            console.log(data)
            router.refresh();
            setLoad(false);
          }

        }).catch((error) => {
          throw new Error(error);
          auth.signOut()
          setLoad(false);
        })
      } else {
        setUser(null);
        console.log("no user got yet")
        router.push("/");
      }
    })
  }, [])

  const pathname = usePathname();

  return (
    <RootContext.Provider value={{
      user: [user, setUser],
      load: [load, setLoad]
    }}>
      <html lang="en">
        <head>
          <title>king chess</title>
        </head>
        <body>

          {load && <Loading />}
          <div className="w-screen h-screen overflow-hidden flex flex-grow-[1] bg-gray-700">


            {user && <Nav />}
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </body>
      </html>
    </RootContext.Provider>
  );
}

export { RootContext };
