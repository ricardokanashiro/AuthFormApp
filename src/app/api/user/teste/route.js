import { User } from "../../../../../database/models/User"

export async function GET() {
   const users = await User.find()

   return new Response(JSON.stringify(users), { status: 200 })
}