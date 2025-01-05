import jwt from "jsonwebtoken"

import { User } from "../../../../../database/models/User"

export async function GET(request) {

   const access_token = request.cookies.get('access_token') ? request.cookies.get('access_token').value : ""
   let payload

   try
   {
      payload = jwt.verify(access_token, process.env.JWT_SECRET_KEY)
   }
   catch (error)
   {
      return new Response(JSON.stringify({ error: "Token inválido!", code: "INVALID_TOKEN" }), { status: 500 })
   }

   const { email, provider } = payload

   const user = await User.findOne({ email: email, provider: provider })

   if (!user) {
      return new Response(JSON.stringify({ error: "Usuário não existe!" }), { status: 500 })
   }

   return new Response(JSON.stringify({ success: "Token e usuário válido!" }, { status: 200 }))
}