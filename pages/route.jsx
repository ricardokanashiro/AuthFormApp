import { useEffect, useState } from "react"
import RouteCard from "../components/RouteCard"

const Route = ({ loginData }) => {

   const [isAdm, setIsAdm] = useState(false)

   useEffect(() => {
      
      const loginDataItem = localStorage.getItem("loginData")
      const loginData = JSON.parse(loginDataItem)

      if(!loginData) {
         return
      }
      
      setIsAdm(loginData.role === "adm")

   }, [])

   if(!loginData || !loginData.nome) {
      return
   }

   return (
      <div className="w-full h-full p-[4rem] overflow-auto">

         <h1 className="font-bold text-[3rem]">Bem Vindo {loginData.nome}!</h1>

         <div className="mt-[4rem]">

            <p className="text-[#919190] font-medium text-[1.5rem] mb-[2rem]">ROTAS</p>

            <div className="flex gap-[2rem] flex-wrap items-stretch lg:items-start">

               <RouteCard 
                  image="/unlock.svg"
                  title="Rota Livre"
                  description="Rota permitida para todos os usuários" 
                  active={true}
                  action="/home/free-route"
               />

               <RouteCard 
                  image="/shield-security.svg" 
                  title="Rota Protegida" 
                  description="Rota permitida apenas para administradores"
                  active={isAdm}
                  action="/home/protected-route"
               />

            </div>

         </div>

      </div>
   )
}

export default Route