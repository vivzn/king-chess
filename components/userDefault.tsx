import { RootContext } from '@/context';
import { AdjustmentsHorizontalIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import * as React from 'react';


export default function UserDefault({ user, bg, border }: any) {
    const [user_, setUser] = React.useContext(RootContext).user;
    return (
        <div style={bg && {backgroundColor: bg}} className={`flex justify-between items-center hover:brightness-[1.1] cursor-pointer trans space-x-4 pr-5 rounded-full px-[10px] py-[10px] ${bg ? `` : "bg-slate-700"} ${border && "border-2 border-slate-600"}`}>
            <div className='flex items-center space-x-4'>
                <img className='rounded-full border-slate-500 w-[40px] h-[40px]' src={user?.photoURL} />

                <div className='flex flex-col'>
                    <span className="font-bold text-white text-[14px]">{user?.name.substring(0, 12).toLowerCase()}</span>
                    <span className="font-semibold text-slate-500 text-[12px]">{user?.email.substring(0, 15).toLowerCase()}</span>
                </div>
            </div>

            {user?.email == user_?.email ? <PencilSquareIcon className='w-6 h-6 text-violet-300' /> : <AdjustmentsHorizontalIcon className='w-6 h-6 text-violet-300' />}

        </div>
    );
}
