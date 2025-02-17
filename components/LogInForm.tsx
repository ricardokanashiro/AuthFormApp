"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import TextField from "@mui/material/TextField"
import CircularProgress from "@mui/material/CircularProgress"

import FormSkeleton from "./FormSkeleton"

import { notifyError } from "../utils/notify"

interface SubmitButtonProps {
   action: () => void,
   active: boolean,
   isLoading: boolean
}

const SubmitButton = ({ action, active, isLoading }: SubmitButtonProps) => {

   const style = "bg-[#3b37ff] mt-[4rem] text-white w-full font-medium text-[1.4rem] h-[4rem] rounded-[.4rem] flex justify-center items-center"

   return (
      <button 
         type="submit" 
         className={active ? style : style + " opacity-[.7] cursor-default"} 
         onClick={(active && !isLoading) ? action : () => {}}
      >
         { isLoading ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : "Logar" }
      </button>
   )
}

const LogInForm = () => {

   const [logInCredentials, setLogInCredentials] = useState({
      email: "", senha: ""
   })

   const [isLoading, setIsLoading] = useState(true)
   const [fetchLoading, setFetchLoading] = useState(false)
   const [fetchGoogleLoading, setFetchGoogleLoading] = useState(false)
   const [code, setCode] = useState("")
   const [error, setError] = useState("")

   const router = useRouter()

   async function login() {

      setFetchLoading(true)

      const userResponse = await fetch(
         `${process.env.NEXT_PUBLIC_HOST}/api/user/select?email=${logInCredentials.email}&provider=local`,
         { method: "GET" }
      )

      if(!userResponse.ok) {
         window.location.href = `${process.env.NEXT_PUBLIC_HOST}?error=USER_NOT_SIGN_IN`
         return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            email: logInCredentials.email,
            senha: logInCredentials.senha,
            provider: "local"
         })
      })

      const data = await response.json()

      if (response.ok) {
         router.push('/home')
         localStorage.setItem('loginData', JSON.stringify(data))
      }

      setFetchLoading(false)
   }

   async function googleLogIn() {

      const scope = encodeURIComponent("openid email profile")
      const redirect_uri = encodeURIComponent(`${process.env.NEXT_PUBLIC_HOST}/login`)
      const client_id = encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "")
      const URL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`

      window.location.href = URL
   }

   useEffect(() => {
      
      const url = new URLSearchParams(window.location.search)
      setError(url.get("error") ?? "")
      setCode(url.get("code") ?? "")

      async function validate() {

         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/validate`, {
            method: "GET",
         })

         const data = await response.json()

         if (!response.ok) {

            if(data.code === "INVALID_TOKEN") {

               const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/refreshToken`, { 
                  method: "POST"
               })

               if(!response.ok) {
                  localStorage.clear()
                  setIsLoading(false)
                  return
               }
            }
         }

         router.push('/home')
         setIsLoading(false)
      }

      validate()

   }, [])

   useEffect(() => {

      if(error === "USER_ALREADY_SIGN_IN") {
         notifyError("Um usuário com esse email já está cadastrado!")
      }

   }, [error])

   useEffect(() => {

      let payload: any

      async function validateUser() {

         if (!code || code === "") {
            return
         }

         setFetchGoogleLoading(true)

         const data: Record<string, string> = {
            code: code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
            redirect_uri: `${process.env.NEXT_PUBLIC_HOST}/login`,
            grant_type: "authorization_code"
         }

         await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString()
         })
            .then((response) => response.json())
            .then((tokenData) => {
               const idToken = tokenData.id_token
               payload = JSON.parse(atob(idToken.split(".")[1]))
            })
            .catch((error) => console.error("Erro ao trocar o código pelo token:", error))

         if (!payload) {
            setFetchGoogleLoading(false)
            return
         }

         const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/user/select?email=${payload.email}&provider=google`,
            { method: "GET" }
         )
   
         if(!userResponse.ok) {
            window.location.href = `${process.env.NEXT_PUBLIC_HOST}?error=USER_NOT_SIGN_IN`
            return
         }

         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: payload.email, provider: "google" })
         })

         const fetchData = await response.json()

         if (response.ok) {
            router.push("/home")
            localStorage.setItem("loginData", JSON.stringify(fetchData))
         }

         setFetchGoogleLoading(false)
      }

      validateUser()

   }, [code])

   if(isLoading) {
      return ( <FormSkeleton /> )
   }

   return (

      <form onSubmit={(e) => e.preventDefault()} className="w-full h-full flex gap-[2rem]">

         <div className="hidden lg:flex bg-[#3b37ff] w-[4rem] h-full flex-[.7] flex-col justify-center items-center">

            <div className="w-full flex flex-col justify-center items-center">
               <img src="/open-id-logo.png" alt="logo image" className="h-[16rem]" />
               <h1 className="text-white font-bold text-[5rem]">Auth App</h1>
            </div>

            <p className="text-center text-[#cac9ff] font-medium w-[30rem] mt-[2rem] text-[1.05rem]">Um app feito para estudar o protocolo OpenID Connect para autenticação e autorização através de terceiros.</p>

         </div>

         <div className="flex-1 flex flex-col items-center p-[2rem] pl-[8dvw] pr-[8dvw] sm:pl-[2rem] sm:pr-[2rem] h-full">

            <div className="w-full sm:w-[40rem] flex flex-col flex-1 justify-center items-center">

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
                        onChange={(e) => setLogInCredentials(prev => ({ ...prev, email: e.target.value }))}
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
                        onChange={(e) => setLogInCredentials(prev => ({ ...prev, senha: e.target.value }))}
                     />

                     <SubmitButton 
                        action={login}
                        active={
                           logInCredentials.email !== "" 
                           && logInCredentials.senha !== ""
                        }
                        isLoading={fetchLoading}
                     />

                     <div className="w-full flex items-center gap-[5px] mt-[2rem] mb-[2rem]">

                        <div className="flex-1 border-[1px] border-[#e3e3e3] border-solid h-[1px]"></div>
                        <p className="text-[#919190] text-[1.2rem]">OU</p>
                        <div className="flex-1 border-[1px] border-[#e3e3e3] border-solid h-[1px]"></div>

                     </div>

                     <button className="flex items-center justify-center gap-[1rem] w-full border-[1px] border-[#c0c0c0] border-solid rounded-[.4rem] h-[4rem]" onClick={fetchGoogleLoading ? () => {} : googleLogIn}>
                        { fetchGoogleLoading 
                           ? <CircularProgress size={20} sx={{ color: '#000' }} />
                           : <>
                              <img src="/google-logo.svg" alt="google logo" className="w-[3rem]" />
                              <p className="text-[1.1rem]">Logar com Conta Google</p>
                           </> 
                        }
                        
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