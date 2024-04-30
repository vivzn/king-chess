"use client";

import UserDefault from '@/components/userDefault';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Users() {

    const pathname = usePathname().replace("/users/", '')
    const [thisUser, setThisUser] = useState<any>(null);
    useEffect(() => {
        axios.post('/api/get-user', { _id: pathname }).then((data: any) => {
            if (!data?.data) {
                setThisUser("no")
                return;
            }
           setThisUser(data?.data)
        });
    }, [])

    if (thisUser == "no") {
        return <div className='w-full h-full p-8'>
            <div className='bg-slate-800 rounded-2xl p-4 flex justify-center font-semibold text-white space-x-2'>
                <span className='text-indigo-300'>{pathname}</span> <span>user id does not exist</span>
            </div>
        </div>
    }

    return (
        <div className='w-full h-full p-8'>
            <div className='bg-slate-800 rounded-2xl p-4 flex flex-col space-y-4 font-semibold text-white'>
                <UserDefault user={thisUser} />

                <div className='flex space-y-2 flex-col'>
                    <h1 className='text-xl'>{thisUser?.name}'s elo</h1>
                    <span className='text-indigo-300 text-2xl'>{thisUser?.elo}</span>
                </div>

                <div className='flex space-y-2 flex-col'>
                    <h1 className='text-xl'>{thisUser?.name}'s matches played</h1>
                    <span className='text-indigo-300 text-2xl'>this feature is coming soon</span>
                </div>

            </div>
        </div>
    );
}
