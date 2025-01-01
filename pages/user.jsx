"use client"

import { useRouter } from "next/navigation"

const ListItem = ({ label, value }) => {
   return (
      <li className="mt-[.3rem]">
         <p className="text-[1.3rem]"><b>{label}</b>: {value}</p>
      </li>
   )
}

const User = ({ loginData }) => {

   const router = useRouter()

   async function deleteAccount() {

      const loginDataItem = localStorage.getItem("loginData")
      let loginData

      if(loginDataItem) {
         loginData = JSON.parse(loginDataItem)
      }

      console.log(loginData.token)

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/delete`, {
         method: "DELETE",
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ token: loginData.token })
      })

      if(response.ok) {
         localStorage.clear()
         router.push("/")
      }

      const data = await response.json()

      console.log(data)
   }

   return (
      <div className="p-[4rem]">

         <h2 className="font-bold text-[3rem]">{loginData.nome}</h2>

         <ul className="mt-[2rem]">
            <ListItem label="Email" value={loginData.email} />
            <ListItem label="Role" value={loginData.role} />
            <ListItem label="Provider" value={loginData.provider} />
         </ul>

         <p className="mt-[3rem] mb-[2rem] font-medium text-[#919190] text-[1.5rem]">Actions</p>

         <button className="flex gap-[1rem] justify-center items-center bg-[#3b37ff] p-[1rem] rounded-[.4rem]" onClick={deleteAccount}>
            <img src="/icon-trash.svg" alt="delete icon" className="w-[1.4rem]" />
            <p className="text-white font-medium text-[1.1rem]">Deletar Conta</p>
         </button>

      </div>
   )
}

export default User