import { User } from "../../../../../database/models/User"

export async function GET(request) {

   const url = new URL(request.url)
   const email = url.searchParams.get("email")
   const provider = url.searchParams.get("provider")

   const user = await User.findOne({ email, provider })

   if(!user) {
      return new Response(JSON.stringify({ error: "Usuário não existe!", code: "USER_DONT_EXIST" }), { status: 500 })
   }

   return new Response(JSON.stringify(user), { status: 200 })
}