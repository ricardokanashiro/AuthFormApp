import jwt from "jsonwebtoken"

import { User } from "../../../../database/models/User"

export async function POST(req) {

   const refresh_token = req.cookies.get('refresh_token').value
   let payload

   try
   {
      payload = jwt.verify(refresh_token, process.env.JWT_SECRET_KEY)
   }
   catch (error) 
   {
      return new Response(JSON.stringify(
         { error: { message: "Refresh token inválido ou expirado!", code: "INVALID_REFRESH_TOKEN" } }
      ), { status: 400 })
   }

   const user = await User.findOne({ email: payload.email, provider: payload.provider })

   if (!user) {
      return new Response(JSON.stringify(
         { error: { message: "Usuário não encontrado!", code: "USER_NOT_FOUND" } }), 
      { status: 400 })
   }


   const data = { email: user.email, nome: user.nome, provider: user.provider, role: user.role }
   const access_token = jwt.sign(data, process.env.JWT_SECRET_KEY)
   
   const cookie = `access_token=${access_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=60`

   return new Response(JSON.stringify(data), {
      status: 200, 
      headers: { 
         "Content-Type": 'application/json',
         "Set-Cookie": cookie
      },
   })
}