"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

const page = () => {

   const router = useRouter()
   const [role, setRole] = useState("")
   const [code, setCode] = useState("")

   async function getGoogleTokens() {

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? ""
      const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? ""

      let payload

      if (!code) {
         return
      }

      const data: Record<string, string> = {
         code: code,
         client_id: clientId,
         client_secret: clientSecret,
         redirect_uri: redirectUri,
         grant_type: "authorization_code"
      }

      await fetch("https://oauth2.googleapis.com/token", {
         method: "POST",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded"
         },
         body: new URLSearchParams(data)
      })
         .then((response) => response.json())
         .then((tokenData) => {
            console.log(tokenData)
            const idToken = tokenData.id_token
            payload = JSON.parse(atob(idToken.split(".")[1]))
         })
         .catch((error) => console.error("Erro ao trocar o código pelo token:", error))

      if (!payload) {
         return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/signin`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: payload.email, provider: "google", nome: payload.name, role: role })
      })

      const fetchData = await response.json()

      if (response.ok) {
         router.push('/home')
         localStorage.setItem('loginData', JSON.stringify(fetchData))
      }
   }

   useEffect(() => {

      const queryParams = new URLSearchParams(window.location.search)
      setCode(queryParams.get("code") ?? "")
      
   }, [])

   return (
      <div className="w-full h-full flex justify-center items-center">

         <div className="w-[35rem]">

            <div className="w-full flex flex-col justify-center items-center bg-[#3b37ff] p-[3rem] rounded-t-[.6rem]">
               <img src="/open-id-logo.png" alt="logo image" className="h-[5rem]" />
               <h1 className="text-white font-bold text-[2rem]">Auth App</h1>
            </div>

            <form 
               className="shadow-custom-darker bg-white p-[3rem] flex flex-col gap-[3rem] w-full rounded-b-[.6rem]"
               onSubmit={(e) => e.preventDefault()}
            >

               <div className="w-full">
                  <h1 className="text-center font-bold text-[2.8rem]">Selecione o role</h1>
               </div>

               <fieldset>

                  <div className="w-full flex flex-col justify-center items-center">

                     <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                        <FormLabel style={{ fontSize: '14px', marginRight: '20px' }}>Role</FormLabel>

                        <RadioGroup row onChange={(e) => setRole(e.target.value)}>

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

                  </div>

               </fieldset>

               <button
                  type="submit" 
                  className="bg-[#3b37ff] text-white font-semibold text-[1.3rem] p-[1rem] rounded-[.4rem]" 
                  onClick={getGoogleTokens}
               >
                  Criar conta
               </button>

            </form>

         </div>

      </div>
   )
}

export default page