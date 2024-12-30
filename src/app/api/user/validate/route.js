import jwt from "jsonwebtoken"

import { User } from "../../../../../database/models/User"

export async function POST(request) {

   const body = await request.json()
   const { token } = body

   try {

      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)

      const { email, provider } = payload

      const user = await User.findOne({ email: email, provider: provider })

      if (!user) {
         return new Response(JSON.stringify({ error: "Usuário não existe!" }), { status: 500 })
      }

      return new Response(JSON.stringify({ success: "Token e usuário válido!" }, { status: 200 }))

   }
   catch (error) {
      return new Response(JSON.stringify({ error: "Token inválido!" }), { status: 500 })
   }
}