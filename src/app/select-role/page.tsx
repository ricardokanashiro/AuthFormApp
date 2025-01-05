"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import CircularProgress from "@mui/material/CircularProgress"

import SelectRoleSkeleton from "../../../components/SelectRoleSkeleton"

interface SubmitButton {
   action: () => void,
   active: boolean,
   isLoading: boolean
}

const SubmitButton = ({ action, active, isLoading }: SubmitButton) => {

   const style = "bg-[#3b37ff] text-white font-semibold text-[1.3rem] p-[1rem] rounded-[.4rem]"

   return (
      <button
         type="submit"
         className={active ? style : style + " opacity-[.7] cursor-default"}
         onClick={(active && !isLoading) ? action : () => {}}
      >
         { isLoading ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : "Criar conta" }
      </button>
   )
}

const page = () => {

   const router = useRouter()

   const [role, setRole] = useState("")
   const [fetchLoading, setFetchLoading] = useState(false)
   const [pageLoading, setPageLoading] = useState(true)

   const payload = useRef<any>({})

   async function getGoogleTokens() {

      setFetchLoading(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/signin`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: payload.current.email, provider: "google", nome: payload.current.name, role: role })
      })

      const fetchData = await response.json()

      if (response.ok) {
         router.push('/home')
         localStorage.setItem('loginData', JSON.stringify(fetchData))
      }

      setFetchLoading(false)
   }

   useEffect(() => {

      setPageLoading(true)

      async function fetchUser() {

         const queryParams = new URLSearchParams(window.location.search)
         const code = queryParams.get("code") ?? ""

         const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
         const redirectUri = `${process.env.NEXT_PUBLIC_HOST}/select-role`
         const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? ""

         if (!code) {
            router.push("/login")
            setPageLoading(false)
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
               const idToken = tokenData.id_token
               payload.current = JSON.parse(atob(idToken.split(".")[1]))
            })
            .catch((error) => console.error("Erro ao trocar o código pelo token:", error))

         if (!payload.current) {
            setPageLoading(false)
            return
         }

         const selectUserRes = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/user/select?email=${payload.current.email}&provider=google`, {
               method: "GET"
            }
         )

         if (selectUserRes.ok) {
            window.location.href = `${process.env.NEXT_PUBLIC_HOST}/login?error=USER_ALREADY_SIGN_IN`
            setPageLoading(true)
         }
      }

      fetchUser()

   }, [])

   if(pageLoading) {
      return (
         <SelectRoleSkeleton />
      )
   }

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

               <SubmitButton action={getGoogleTokens} active={role !== ""} isLoading={fetchLoading} />

            </form>

         </div>

      </div>
   )
}

export default page