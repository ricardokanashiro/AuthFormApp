"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const page = () => {

   const router = useRouter()

   useEffect(() => {

      async function fetchUser() {

         const loginDataItem = localStorage.getItem("loginData")

         if(!loginDataItem) {
            router.push("/home")
            return
         }

         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/validateRole`, {
            method: "POST"
         })

         if(!response.ok) {
            router.push("/home")
            return
         }

         const data = await response.json()
         
         if(data.role !== "adm") {
            router.push("/home")
            return
         }
      }

      fetchUser()

   }, [])

   return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-[1.5rem]">

         <h1 className="font-bold text-[2.5rem]">Welcome! You're in PROTECTED route 🥳</h1>

         <a href="/home">
            <button className="bg-[#3b37ff] text-white font-semibold text-[1.4rem] p-[1rem] rounded-[.4rem]">Go back</button>
         </a>

      </div>
   )
}

export default page