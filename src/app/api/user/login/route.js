import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { User } from "../../../../../database/models/User"

export async function POST(request) {

   const body = await request.json()
   const { email, senha, provider } = body

   const user = await User.findOne({ email, provider: provider })

   if(!user) {
      return new Response(JSON.stringify({ error: "O usuário não existe!" }), { status: 400 })
   }

   if(senha) {
      const passwordMatch = await bcrypt.compare(senha, user.senha)
   
      if(!passwordMatch) {
         return new Response(JSON.stringify({ error: "O usuário não existe!" }), { status: 400 })
      }
   }

   const payload = { email: user.email, nome: user.nome, role: user.role, provider: user.provider }

   const access_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 600 })
   const refresh_token = jwt.sign({ email: user.email, provider: user.provider }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })

   const cookie = [
      `access_token=${access_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=600`, // expires in 10 minutes
      `refresh_token=${refresh_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=604800` // expires in 7 days
   ]

   return new Response(JSON.stringify({ nome: user.nome, email: user.email, role: user.role, provider: user.provider }), { 
      status: 200,
      headers: {
         "Content-Type": "application/json",
         "Set-Cookie": cookie.join(", ")
      }
   })
}