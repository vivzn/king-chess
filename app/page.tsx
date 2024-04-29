"use client";

import { auth as authFB, provider } from "@/firebase";
import axios from "axios";
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { getRedirectError } from "next/dist/client/components/redirect";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { BookmarkIcon, CubeTransparentIcon, EllipsisHorizontalCircleIcon, InformationCircleIcon, LinkIcon, MinusIcon, PencilSquareIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { SparklesIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
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
            <SparklesIcon className="w-[34px] h-[34px] text-violet-400" />
            <span className="tracking-wide text-[24px] w-[155px] text-slate-200 font-bold">king chess</span>
          </div>

          <div className="flex space-x-4 items-center">
            <div onClick={() => router.push("https://docs.google.com/forms/d/e/1FAIpQLSeKHf540HB4dIUFTB_RANsbEUeoB8UAn8X_UIx8s1Z5XGBEiA/viewform?usp=sf_link")} className="rounded-full hover:bg-slate-600 transition duration-200 ease-in-out p-[10px] border-2 border-slate-600">
              <InformationCircleIcon className="w-5 h-5 text-slate-500 stroke-[2]" />
            </div>
            <div onClick={() => {
              alert("copied to clipboard");
              navigator.clipboard.writeText(window?.location?.href)
            }} className="rounded-full hover:bg-slate-600 transition duration-200 ease-in-out p-[10px] border-2 border-slate-600">
              <LinkIcon className="w-5 h-5 text-slate-500 stroke-[2]" />
            </div>
            <div onClick={signIn} className="rounded-full hover:brightness-110 trans cursor-pointer p-[10px] px-[14px] text-white bg-gradient-to-r from-violet-500 to-purple-400 flex items-center space-x-2">
              <ArrowLeftCircleIcon className="w-5 h-5 stroke-[2] text-white-600/80" />
              <span className="font-semibold">sign in</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full px-80">

        <div className="w-full flex items-center justify-center space-x-10">
          {/* <video className="w-[245px] brightness-[1.15] h-[350px] object-cover rounded-full" autoPlay muted loop>
            <source src="/loopvideo.mp4" type="video/mp4" />
          </video> */}
          <div className="flex flex-col space-y-8 items-center w-fit">

            <div className="border-2 p-1 px-4 rounded-full border-violet-400/30 bg-violet-400/10 ">
              <span className="font-semibold colorGradient">beta version released</span>
            </div>

            <h1 className="font-bold text-[80px] leading-[80px] w-[1300px] text-center text-white">this is the new <br /> <span className="colorGradient">standard for chess</span></h1>

            <p className="font-semibold text-slate-400 text-xl text-center">Play, Learn, Rank, and more.</p>
            <div className="flex items-center space-x-4">
              <div onClick={() => router.push("/https://github.com/vivzn/king-chess")} className="rounded-full hover:brightness-110 trans cursor-pointer p-[10px] px-[14px] text-slate-300 bg-slate-600 flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 stroke-[2.5] text-white-600/80" />
                <span className="font-semibold">view open source</span>
              </div>
              <div onClick={signIn} className="rounded-full hover:brightness-110 trans cursor-pointer p-[10px] px-[14px] text-white bg-gradient-to-r from-violet-500 to-purple-400 flex items-center space-x-2">
                <ArrowLeftCircleIcon className="w-5 h-5 stroke-[2] text-white-600/80" />
                <span className="font-semibold">sign in</span>
              </div>

            </div>



            <div className="flex p-4 bg-black/10 w-[700px] flex-col space-y-4 items-center space-x-2 rounded-2xl font-semibold text-white">
              <div className="flex items-center space-x-4">
                <PencilSquareIcon className="w-8 h-8 text-violet-300 stroke-[2]" />
                <span className="text-2xl">Change Logs</span>
              </div>
              <ol className="list-disc flex flex-col space-y-4">


                <li className="flex items-center space-x-2">
                  <span className="text-violet-300">4/27/24</span>
                  <MinusIcon className="w-5 h-5 text-white stroke-[2]" />
                  <span>improved move latency by changing to Singapore servers, added resignation, and changed basic ui/colors</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-violet-300">4/25/24</span>
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
