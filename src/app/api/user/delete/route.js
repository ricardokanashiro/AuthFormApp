import jwt from 'jsonwebtoken'

import { User } from "../../../../../database/models/User"

export async function DELETE(request) {

   const body = await request.json()
   const { token } = body

   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
      await User.deleteOne({ email: payload.email, provider: payload.provider })
      return new Response(JSON.stringify({ success: "O usuário foi deletado com sucesso!" }), { status: 200 })
   } 
   catch (err) {
      return new Response(JSON.stringify({ error: `Token inválido ou expirado: ${err.message}` }), { status: 400 })
   }
}