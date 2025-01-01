import jwt from "jsonwebtoken"
import { User } from "../../../../../database/models/User"

export async function POST(request) {

   const body = await request.json()
   const { token } = body

   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
      const user = await User.findOne({ email: payload.email, provider: payload.provider })

      if(!user) {
         return new Response(JSON.stringify({ error: "Usuário inválido!", code: "INVALID_USER" }), { status: 400 })
      }

      return new Response(JSON.stringify({ role: user.role }))
   } 
   catch (err) {
      return new Response(JSON.stringify({ error: err.message, code: "GET_USER_ROLE_ERR" }))  
   }
}