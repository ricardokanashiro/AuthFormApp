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

   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

   return new Response(JSON.stringify({ token, nome: user.nome, email: user.email, role: user.role, provider: user.provider }), { status: 200 })
}