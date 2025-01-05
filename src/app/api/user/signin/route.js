import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { User } from "../../../../../database/models/User"

export async function POST(request) {

   const body = await request.json()
   const { nome, email, senha, role, provider } = body

   let errors = []

   const previousUser = await User.findOne({ email, provider })

   if(previousUser) {
      return new Response(JSON.stringify({ message: "Usuário já está cadastrado!", code: "USER_ALREADY_SIGN_IN" }), { status: 500 })
   }

   if (senha) {

      const hashedPassword = await bcrypt.hash(senha, 10)

      await User.create({
         nome: nome,
         email: email,
         senha: hashedPassword,
         role: role,
         provider: provider
      })
         .catch(error => errors.push(error))

      if (senha.length > 20) {
         errors.push({ message: "PASSWORD_TOO_LONG" })
      }
   }
   else 
   {
      await User.create({
         nome: nome,
         email: email,
         role: role,
         provider: provider
      })
         .catch(error => errors.push(error))
   }

   if (errors.length > 0) {

      const formatedErrors = errors.map(error => {

         if (error.message.includes("PASSWORD_REQUIRED")) {
            return { code: "PASSWORD_REQUIRED", message: "É necessário cadastrar uma senha!" }
         }

         if (error.message.includes("PASSWORD_TOO_LONG")) {
            return { code: "PASSWORD_TOO_LONG", message: "O tamanho da senha ultrapassa o tamanho máximo de 20 caracteres!" }
         }

         if (error.message.includes("NOT_AN_EMAIL")) {
            return { code: "NOT_AN_EMAIL", message: "O email não é válido!" }
         }

         if (error.code === 11000) {

            if (error.message.includes("email_1") && error.message.includes("provider_1")) {
               return { code: "ACCOUNT_ALREADY_EXISTS", message: "A conta já foi registrada com esse email!" }
            }
         }

         return error.message
      })

      return new Response(JSON.stringify({ errors: formatedErrors }), { status: 400 })
   }

   const user = { nome, email, role, provider }

   const access_token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: 600 })
   const refreshToken = jwt.sign({ email, provider }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })

   const cookie = [
      `access_token=${access_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=600`, // expires in 10 minutes
      `refresh_token=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=604800` // expires in 7 days
   ]

   return new Response(JSON.stringify({ nome, email, role, provider }), {
      status: 200,
      headers: {
         "Content-Type": "application/json",
         "Set-Cookie": cookie.join(", ")
      }
   })
}