import React,{ useContext } from 'react'
import Sidebar from '@/Sidebar'
import AuthContext from "@/context/AuthContext"; // Import context

export default function HeaderMenu() {
    const { userData } = useContext(AuthContext);

   
    
  return (
    <header className='border-b w-full sticky top-0 z-50 bg-pSnow text-black flex justify-between items-center '>
        <Sidebar userPremissions={userData.permissions} />
        <h1 className='text-2xl font-bold p-3'>
       سجل   بيانات مدراء الادارات المكاتب بالبلديات (التحول الرقمي)  
        </h1>
       <div className=' flex items-center gap-1 justify-between p-3'>
        {userData.name}
       <i
    className="relative bg-pBrilliantAzure inline-block h-7 w-7  rounded-full  object-cover object-center"
  />
       </div>
    </header>
  )
}
