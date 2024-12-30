"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import TextField from "@mui/material/TextField"

const LogInForm = () => {

   const [logInCredentials, setLogInCredentials] = useState({
      email: "", senha: ""
   })

   const router = useRouter()

   async function createUser() {

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            email: logInCredentials.email,
            senha: logInCredentials.senha,
         })
      })

      const data = await response.json()

      if(response.ok) {
         router.push('/home')
         localStorage.setItem('loginData', JSON.stringify(data))
      }
   }

   useEffect(() => {
      
      async function validate() {

         const loginDataItem = localStorage.getItem("loginData") ?? ""
         let loginData

         if(loginDataItem) {
            loginData = JSON.parse(loginDataItem)
         }

         if(!loginData.token) {
            return
         }

         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/validate`, {
            method: "POST",
            headers: { 
               'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ token: loginData.token })
         })

         if(!response.ok) {
            localStorage.clear()
            return
         }

         router.push('/home')
      }

      validate()

   }, [])

   return (
      
      <form onSubmit={(e) => e.preventDefault()} className="w-full h-full flex gap-[2rem]">

         <div className="bg-[#3b37ff] w-[4rem] h-full flex-[.7] flex flex-col justify-center items-center">

            <div className="w-full flex flex-col justify-center items-center">
               <img src="/open-id-logo.png" alt="logo image" className="h-[16rem]" />
               <h1 className="text-white font-bold text-[5rem]">Auth App</h1>
            </div>

            <p className="text-center text-[#cac9ff] font-medium w-[30rem] mt-[2rem] text-[1.05rem]">Um app feito para estudar o protocolo OpenID Connect para autenticação e autorização através de terceiros.</p>

         </div>

         <div className="flex-1 flex flex-col items-center p-[2rem] h-full">

            <div className="w-[40rem] flex flex-col flex-1 justify-center items-center">

               <div className="w-full">

                  <h2 className="font-semibold text-[3.2rem] text-center">Entre com sua conta</h2>

                  <p className="text-[#919190] text-center mt-[.5rem] text-[1.1rem]">
                     Insira suas credenciais para cadastrar conta ou logue com sua conta Google!
                  </p>

               </div>

               <fieldset className="mt-[5rem] w-full flex flex-col">

                  <div className="flex flex-col w-full justify-center items-center">

                     <TextField
                        size="small"
                        label="Email"
                        type="email"
                        sx={{
                           '& .MuiInputBase-input': { fontSize: '14px', },
                           '& .MuiInputLabel-root': { fontSize: '14px' },
                           '& .MuiInputLabel-root.Mui-focused': {
                              color: '#3b37ff',
                           },
                           '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                 borderColor: '#3b37ff',
                              },
                           },
                           width: '100%',
                           marginTop: '1.6rem'
                        }}
                        onChange={(e) => setLogInCredentials(prev => ({...prev, email: e.target.value}))}
                     />

                     <TextField
                        size="small"
                        label="Senha"
                        type="password"
                        sx={{
                           '& .MuiInputBase-input': { fontSize: '14px', },
                           '& .MuiInputLabel-root': { fontSize: '14px' },
                           '& .MuiInputLabel-root.Mui-focused': {
                              color: '#3b37ff',
                           },
                           '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                 borderColor: '#3b37ff',
                              },
                           },
                           width: '100%',
                           marginTop: '1.6rem'
                        }}
                        onChange={(e) => setLogInCredentials(prev => ({...prev, senha: e.target.value}))}
                     />

                     <button type="submit" className="bg-[#3b37ff] mt-[4rem] text-white w-full font-medium text-[1.4rem] h-[4rem] rounded-[.4rem]" onClick={createUser}>
                        Logar
                     </button>

                     <div className="w-full flex items-center gap-[5px] mt-[2rem] mb-[2rem]">

                        <div className="flex-1 border-[1px] border-[#e3e3e3] border-solid h-[1px]"></div>
                        <p className="text-[#919190] text-[1.2rem]">OU</p>
                        <div className="flex-1 border-[1px] border-[#e3e3e3] border-solid h-[1px]"></div>

                     </div>

                     <button className="flex items-center justify-center gap-[1rem] w-full border-[1px] border-[#c0c0c0] border-solid rounded-[.4rem] h-[4rem]">
                        <img src="/google-logo.svg" alt="google logo" className="w-[3rem]" />
                        <p className="text-[1.1rem]">Logar com Conta Google</p>
                     </button>

                  </div>

               </fieldset>

            </div>

            <p>
               Não tem uma conta? Cadastre-se <a href="/" className="text-[#3b37ff] font-semibold">Aqui</a>.
            </p>

         </div>

      </form>
   )
}

export default LogInForm