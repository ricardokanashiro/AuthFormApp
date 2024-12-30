import jwt from "jsonwebtoken"

import { User } from "../../../../../database/models/User"

export async function POST(request) {

   const body = await request.json()
   const { email, senha } = body

   const user = await User.findOne({ email, senha })

   if(!user) {
      return new Response(JSON.stringify({ error: "O usuário não existe!" }), { status: 400 })
   }

   const payload = { email: user.email, nome: user.nome, role: user.role, provider: user.provider }

   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

   return new Response(JSON.stringify({ sucess: token }), { status: 200 })
}