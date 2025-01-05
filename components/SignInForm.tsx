"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import TextField from "@mui/material/TextField"
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import CircularProgress from "@mui/material/CircularProgress"

import FormSkeleton from "./FormSkeleton"

interface ButtonProps {
   active: boolean,
   action: () => void,
   isLoading: boolean
}

const SubmitButton = ({ active, action, isLoading }: ButtonProps) => {

   const style = "bg-[#3b37ff] mt-[4rem] text-white w-full font-medium text-[1.4rem] h-[4rem] rounded-[.4rem] flex justify-center items-center"

   return (
      <button 
         type="submit" 
         className={active ? style : style + " opacity-[0.7] cursor-default"}
         onClick={(active && !isLoading) ? action : () => {}}
      >
         { isLoading ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : "Cadastrar" }
      </button>
   )
}

const SignInForm = () => {

   const [signInCredentials, setSignInCredentials] = useState({
      nome: "", email: "",
      senha: "", role: ""
   })

   const [isLoading, setisLoading] = useState(true)
   const [fetchLoading, setFetchLoading] = useState(false)
   const [fetchGoogleLoading, setFetchGoogleLoading] = useState(false)

   const router = useRouter()

   async function createUser() {

      setFetchLoading(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/signin`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            nome: signInCredentials.nome,
            email: signInCredentials.email,
            senha: signInCredentials.senha,
            role: signInCredentials.role,
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

   function googleSignIn() {

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_SIGN_IN_REDIRECT_URI ?? ""
      const scope = "openid email profile"

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`

      window.location.href = authUrl
   }

   useEffect(() => {

      async function validate() {

         setFetchGoogleLoading(true)

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
                  localStorage.clear()
                  setisLoading(false)
                  setFetchGoogleLoading(false)
                  return
               }

            }
         }

         router.push('/home')
         setisLoading(false)
         setFetchGoogleLoading(false)
      }

      validate()

   }, [])

   if(isLoading) {
      return ( <FormSkeleton /> )
   }

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

                  <h2 className="font-semibold text-[3.2rem] text-center">Cadastre-se</h2>

                  <p className="text-[#919190] text-center mt-[.5rem] text-[1.1rem]">
                     Insira suas credenciais para cadastrar conta ou logue com sua conta Google!
                  </p>

               </div>

               <fieldset className="mt-[5rem] w-full flex flex-col">

                  <div className="flex flex-col w-full justify-center items-center">

                     <TextField
                        size="small"
                        label="Nome"
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
                           width: '100%'
                        }}
                        onChange={(e) => setSignInCredentials(prev => ({ ...prev, nome: e.target.value }))}
                     />

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
                        onChange={(e) => setSignInCredentials(prev => ({ ...prev, email: e.target.value }))}
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
                        onChange={(e) => setSignInCredentials(prev => ({ ...prev, senha: e.target.value }))}
                     />

                     <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>

                        <FormLabel style={{ fontSize: '14px', marginRight: '20px' }}>Role</FormLabel>

                        <RadioGroup row onChange={(e) => setSignInCredentials(prev => ({ ...prev, role: e.target.value }))}>

                           <FormControlLabel value="user" control={

                              <Radio size="medium" sx={{
                                 '& .MuiSvgIcon-root': {
                                    fontSize: 24,
                                 },
                              }}
                              />
                           } label="user" sx={{
                              '& .MuiFormControlLabel-label': {
                                 fontSize: '12px'
                              },
                           }} />

                           <FormControlLabel value="adm" control={

                              <Radio size="medium" sx={{
                                 '& .MuiSvgIcon-root': {
                                    fontSize: 24,
                                 },
                              }}
                              />
                           } label="adm" sx={{
                              '& .MuiFormControlLabel-label': {
                                 fontSize: '12px'
                              },
                           }} />

                        </RadioGroup>

                     </FormControl>

                     <SubmitButton
                        action={createUser} 
                        active={
                           signInCredentials.nome !== "" && signInCredentials.email !== ""
                           && signInCredentials.senha !== "" && signInCredentials.role !== ""
                        }
                        isLoading={fetchLoading}
                     />

                     <div className="w-full flex items-center gap-[5px] mt-[2rem] mb-[2rem]">

                        <div className="flex-1 border-[1px] border-[#e3e3e3] border-solid h-[1px]"></div>
                        <p className="text-[#919190] text-[1.2rem]">OU</p>
                        <div className="flex-1 border-[1px] border-[#e3e3e3] border-solid h-[1px]"></div>

                     </div>

                     <button className="flex items-center justify-center gap-[1rem] w-full border-[1px] border-[#c0c0c0] border-solid rounded-[.4rem] h-[4rem]" onClick={fetchGoogleLoading ? () => {} : googleSignIn}>

                        { fetchGoogleLoading ? 
                           <CircularProgress size={20} sx={{ color: '#000' }} />
                           : <>
                              <img src="/google-logo.svg" alt="google logo" className="w-[3rem]" />
                              <p className="text-[1.1rem]">Cadastrar com Conta Google</p>
                           </>
                        }
                        
                     </button>

                  </div>

               </fieldset>

            </div>

            <p>
               Já tem uma conta? Cadastre-se <a href="/login" className="text-[#3b37ff] font-semibold">Aqui</a>.
            </p>

         </div>

      </form>
   )
}

export default SignInForm