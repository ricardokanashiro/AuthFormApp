import { User } from "../../../../../database/models/User"

// export async function GET(req) {
//    const users = await User.find()

//    // const refresh_token = req.cookies.get('refresh_token').value
//    // const access_token = req.cookies.get('access_token').value

//    return new Response(JSON.stringify(users), { status: 200 })
// }

export async function GET() {
   
   try {
      await User.deleteMany({})
      return new Response("foi", { status: 200 })
   } 
   catch (err) 
   {
      return new Response(JSON.stringify(err), { status: 500 })
   }
}