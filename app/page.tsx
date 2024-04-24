"use client";

import { auth as authFB, provider } from "@/firebase";
import axios from "axios";
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { getRedirectError } from "next/dist/client/components/redirect";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { ArrowLeftCircleIcon, BookmarkIcon, CubeTransparentIcon, EllipsisHorizontalCircleIcon, InformationCircleIcon, LinkIcon, MinusIcon, PencilSquareIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { RootContext } from "@/context";

export default function Home() {
  const [load, setLoad] = useContext<any>(RootContext).load;
  const [userFBData, setUserFBData] = useState<any>(null);

  const [user, setUser] = useContext<any>(RootContext).user;
  const router = useRouter();

  const signIn = async () => {
    const auth = authFB;
    signInWithRedirect(auth, provider);

  }



  useEffect(() => {

    setLoad(false);

    const auth = authFB;
    getRedirectResult(auth)
      .then((result: any) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;


        axios.post('/api/create-user', { name: user?.displayName, elo: 500, email: user?.email, photoURL: user?.photoURL }).then((data: any) => {

          if (data?.data) {
            // router.refresh();
          } else throw new Error("soemething went wrong in the api")

        })



      }).catch((error) => {
        // console.warn("an error occured");
      });
  }, [])

  if (user) return (
    <Dashboard />
  )

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll simpleScroll">
      <div className="h-fit w-full p-8 px-[250px]">
        <div className="flex space-x-4 justify-between items-center cursor-pointer select-none">
          <div onClick={() => router.push("/")} className="flex space-x-6 items-center cursor-pointer select-none">
            <SparklesIcon className="w-[34px] h-[34px] text-blue-200" />
            <span className="tracking-wide text-[24px] w-[155px] text-gray-200 font-bold">king chess</span>
          </div>

          <div className="flex space-x-4 items-center">
            <div onClick={() => router.push("https://docs.google.com/forms/d/e/1FAIpQLSeKHf540HB4dIUFTB_RANsbEUeoB8UAn8X_UIx8s1Z5XGBEiA/viewform?usp=sf_link")} className="rounded-full hover:bg-gray-600 transition duration-200 ease-in-out p-[10px] border-2 border-gray-600">
              <InformationCircleIcon className="w-5 h-5 text-gray-500 stroke-[2]" />
            </div>
            <div onClick={() => {
              alert("copied to clipboard");
              navigator.clipboard.writeText(window?.location?.href)
            }} className="rounded-full hover:bg-gray-600 transition duration-200 ease-in-out p-[10px] border-2 border-gray-600">
              <LinkIcon className="w-5 h-5 text-gray-500 stroke-[2]" />
            </div>
            <div onClick={signIn} className="rounded-full hover:brightness-110 trans p-[10px] px-[14px] border-[5px] hover: border-x-blue-500 border-y-transparent text-white bg-blue-400 flex items-center space-x-2">
              <ArrowLeftCircleIcon className="w-5 h-5 stroke-[2] text-blue-500" />
              <span className="font-semibold">sign in</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full px-80">

        <div className="w-full flex items-center justify-center space-x-10 pt-20">
          {/* <video className="w-[245px] brightness-[1.15] h-[350px] object-cover rounded-xl" autoPlay muted loop>
            <source src="/loopvideo.mp4" type="video/mp4" />
          </video> */}
          <div className="flex flex-col space-y-8 items-center w-fit">
            
            <h1 className="font-extrabold text-[100px] leading-[125px] whitespace-nowrap overflow-hidden text-white">king chess</h1>
            <div className="flex items-center space-x-4">

              <div onClick={signIn} className="rounded-full hover:brightness-110 trans cursor-pointer p-[10px] px-[14px] border-[5px] hover: border-x-blue-500 border-y-transparent text-white bg-blue-400 flex items-center space-x-2">
                <ArrowLeftCircleIcon className="w-5 h-5 stroke-[2] text-blue-500" />
                <span className="font-semibold">sign in</span>
              </div>
              <p className="font-semibold text-slate-200 text-xl">to play some chess</p>
            </div>
            <p className="font-semibold text-gray-400 pt-8">king chess (formerly kgv chess) is an <span onClick={() => router.push("https://docs.google.com/forms/d/e/1FAIpQLSeKHf540HB4dIUFTB_RANsbEUeoB8UAn8X_UIx8s1Z5XGBEiA/viewform?usp=sf_link")} className="underline  cursor-pointer text-blue-300">open-source</span> chess website to play and learn chess.</p>
            <div className="flex p-2 px-3 border-gray-600 border-2 items-center space-x-2 rounded-full mt-8">
              <div className="w-[10px] h-[10px] bg-green-400 animate-pulse rounded-full">

              </div>
              <div className="flex items-center space-x-4 w-full">
                <span className="font-bold text-[14px] text-white">canary @ 1.0</span>
               
              </div>
            </div>
            
            
            
            <div className="flex p-4 bg-black/10 w-[700px] flex-col space-y-4 items-center space-x-2 rounded-2xl font-semibold text-white">
              <div className="flex items-center space-x-2">
                <PencilSquareIcon className="w-6 h-6 text-white stroke-[2]" />
                <span>Change Logs</span>
              </div>
              <ol className="list-disc">



                <li className="flex items-center space-x-2">
                  <span className="text-blue-300">canary @ 1.0</span>
                  <MinusIcon className="w-5 h-5 text-white stroke-[2]" />
                  <span>basic features: only playing and sending game links to friends</span>
                </li>
                
              </ol>
            </div>
          </div>

        </div>



        <div className="flex w-full items-center justify-center self-center p-8">
          {/* <Rights/> */}
        </div>

      </div>

    </div>
  );
}
