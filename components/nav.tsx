import { RootContext } from '@/app/layout';
import { auth as authFB } from '@/firebase';
import { ArrowLeftEndOnRectangleIcon, ArrowLeftIcon, ChatBubbleOvalLeftIcon, CogIcon, InboxStackIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { ArrowLeftCircleIcon, Bars3Icon, CpuChipIcon, EnvelopeIcon, ArchiveBoxIcon, InformationCircleIcon, PuzzlePieceIcon, UserCircleIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { CubeTransparentIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function Nav() {
    const router = useRouter();
    const [user, setUser] = React.useContext<any>(RootContext).user;

    const signOut = () => {
        const auth = authFB;
        auth.signOut().then(() => {
            router.refresh();

        })
    }


    return (
        <div className="h-screen bg-gray-800 w-fit flex items-start text-zinc-700 p-6 space-x-6">

            <div className="w-fit space-y-6 h-full flex flex-col">

                <div className='flex items-center w-full h-full space-y-6 justify-between flex-col'>
                    <div className='flex space-y-6 flex-col'>
                        <div onClick={() => router.push("/")} className="flex space-x-6 items-center cursor-pointer select-none">
                            <SparklesIcon className="w-[30px] h-[30px] text-blue-200" />
                            <span className="tracking-wide text-[21px] w-[155px] text-gray-200 font-bold">king chess</span>
                            <div className="rounded-full bg-gray-700 border-2 border-gray-600 text-gray-600 text-sm flex items-center space-x-[6px] justify-center px-[6px]">

                                <InformationCircleIcon className="w-[14px] h-[14px] stroke-[2.5] text-gray-500" />
                                <span className="text-[11px] font-semibold text-white">v0.1</span>
                            </div>
                        </div>
                        <div  onClick={() => router.push("/")} className='flex space-x-6 items-center group cursor-pointer'>
                            <ArchiveBoxIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-gray-600 group-hover:text-blue-300 trans" />
                            <span className="font-[600] text-[18px] text-gray-500 group-hover:text-gray-200 trans">dashboard</span>
                        </div>

                        <div  onClick={() => router.push("/dms")} className='flex space-x-6 items-center group cursor-pointer'>
                            <ChatBubbleOvalLeftIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-gray-600 group-hover:text-blue-300 trans" />
                            <span className="font-[600] text-[18px] text-gray-500 group-hover:text-gray-200 trans">my dms</span>
                        </div>
                        <div onClick={() => router.push("/my-games")} className='flex space-x-6 items-center group cursor-pointer'>
                            <InboxStackIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-gray-600 group-hover:text-blue-300 trans" />
                            <span className="font-[600] text-[18px] text-gray-500 group-hover:text-gray-200 trans">my games</span>
                        </div>
                        <div  onClick={() => router.push("/settings")} className='flex space-x-6 items-center group cursor-pointer'>
                            <CogIcon className="w-[24px] h-[24px] ml-[3px] stroke-[2] text-gray-600 group-hover:text-blue-300 trans" />
                            <span className="font-[600] text-[18px] text-gray-500 group-hover:text-gray-200 trans">settings</span>
                        </div>

                    </div>

                    <div className='flex items-center space-x-6 w-full'>
                        <div onClick={signOut} className="flex cursor-pointer btnAnimation items-center w-fit p-[7px] bg-blue-400/10 rounded-full -[4px]">
                            <ArrowLeftOnRectangleIcon className="w-[20px] text-blue-500 h-[20px] stroke-[2.5]" />
                        </div>
                        <div className='w-full h-fit'>
                            <div className='flex items-center hover:brightness-[1.1] cursor-pointer trans space-x-4 rounded-full bg-gray-700 px-2 py-2'>
                                <Image alt="pic" width={40} height={40} className='rounded-full border-[3px] border-gray-500' src={user?.photoURL} />
                                <div className='flex flex-col'>
                                    <span className="font-bold text-white text-[14px]">{user?.name.substring(0, 12).toLowerCase()}</span>
                                    <span className="font-semibold text-gray-500 text-[12px]">{user?.email.substring(0, 15).toLowerCase()}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}


// <div className="h-full w-fit p-4 bg-slate-200">
//             <p>signed in</p>
//             <button onClick={() => {
//                 console.log("wait")
//                 const auth = authFB;
//                 auth.signOut().then(() => {
//                     router.refresh();

//                 })
//             }} className="bg-red-500">log out</button>
//         </div>