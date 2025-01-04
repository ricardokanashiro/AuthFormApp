import { User } from "../../../../../database/models/User"

export async function GET() {
   console.log("está indo!")
   
   const start = Date.now()
   const users = await User.find().lean()
   const end = Date.now()
   console.log(`Tempo para consulta: ${end - start} ms`)
   return new Response(JSON.stringify(users), { status: 200 })
}

// export async function GET() {
   
//    try {
//       await User.deleteMany({})
//       return new Response("foi", { status: 200 })
//    } 
//    catch (err) 
//    {
//       return new Response(JSON.stringify(err), { status: 500 })
//    }
// }