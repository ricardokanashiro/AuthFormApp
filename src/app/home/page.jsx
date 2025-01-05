"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import MenuBtn from "../../../components/MenuBtn"
import Route from "../../../pages/route"
import User from "../../../pages/user"

import HomeSkeleton from "../../../components/HomeSkeleton"

const page = () => {

   const [pageSelected, setPageSelected] = useState("routes")
   const [loginData, setLoginData] = useState({})
   const [isLoading, setisLoading] = useState(true)

   const router = useRouter()

   async function logOut() {
      
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteCookies`, { method: "POST"})

      router.push("/login")
      localStorage.clear()
      setLoginData({})
   }

   useEffect(() => {

      setisLoading(true)

      async function validate() {

         const loginDataItem = localStorage.getItem("loginData")
         const loginData = await JSON.parse(loginDataItem)

         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/validate`, {
            method: "GET"
         })

         const data = await response.json()

         if (!response.ok) {

            if(data.code === "INVALID_TOKEN") {

               const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/refreshToken`, { 
                  method: "POST"
               })

               if(!response.ok) {
                  router.push('/')
                  setLoginData({})
                  return
               }
            }
         }

         setLoginData(loginData)
         setisLoading(false)
      }

      validate()

   }, [])

   if (isLoading) {
      return <HomeSkeleton />
   }

   return (
      <div className="flex w-full h-full">

         <div className="bg-[#fafaff] h-full w-[20rem] w-max-[20rem] pt-[2rem] pr-[1.5rem] pl-[1.5rem] pb-[2rem] shrink-0 flex flex-col">

            <div className="w-full flex flex-col justify-center items-center">
               <img src="/logo-bluepng.png" alt="logo" className="w-[6rem]" />
               <h1 className="text-[#3b37ff] font-bold text-[2rem]">Auth App</h1>
            </div>

            <nav className="mt-[4rem]">
               <ul className="flex flex-col gap-[1rem]">

                  <MenuBtn
                     image="/icon-truck-gray.svg"
                     title="Rotas"
                     active={pageSelected === "routes"}
                     activeImage="/icon-truck.svg"
                     handleClick={() => setPageSelected("routes")}
                  />

                  <MenuBtn
                     image="/icon-user-gray.svg"
                     title="Usuário"
                     active={pageSelected === "user"}
                     activeImage="/icon-user-1.svg"
                     handleClick={() => setPageSelected("user")}
                  />

               </ul>
            </nav>

            <div className="flex-1 flex flex-col justify-end">

               <button className="flex p-[.8rem] justify-start items-center border-[#919190] border-[.2rem] border-solid rounded-[.4rem]" onClick={logOut}>
                  <img src="/icon-log-out.svg" alt="logout icon" className="w-[2rem]" />
                  <p className="text-[#919190] font-semibold text-[1.4rem] flex-1 text-center ml-[-1rem]">Logout</p>
               </button>

            </div>

         </div>

         <div>
            {pageSelected === "routes" && <Route loginData={loginData} />}
            {pageSelected === "user" && <User loginData={loginData} />}
         </div>
      </div>
   )
}

export default page