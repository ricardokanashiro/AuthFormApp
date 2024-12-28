import jwt from "jsonwebtoken"
import { User } from "../../../../database/models/User"

export async function POST(request) {

   const body = await request.json()
   const { nome, email, senha, role } = body

   let errors = []

   await User.create({
      nome: nome,
      email: email,
      senha: senha,
      role: role,
      provider: "local"
   })
   .catch(error => errors.push(error))

   if(errors.length > 0) {

      const formatedErrors = errors.map(error => {

         if(error.message.includes("PASSWORD_REQUIRED")) {
            return { code: "PASSWORD_REQUIRED", message: "É necessário cadastrar uma senha!" }
         }

         if(error.message.includes("PASSWORD_TOO_LONG")) {
            return { code: "PASSWORD_TOO_LONG", message: "O tamanho da senha ultrapassa o tamanho máximo de 20 caracteres!"}
         }

         if(error.message.includes("NOT_AN_EMAIL")) {
            return { code: "NOT_AN_EMAIL", message: "O email não é válido!" }
         }

         if(error.code === 11000) {

            if(error.message.includes("email_1") && error.message.includes("provider_1")) {
               return { code: "ACCOUNT_ALREADY_EXISTS", message: "A conta já foi registrada com esse email!" }
            }
         }

         return error.message
      })

      return new Response(JSON.stringify({ "errors": formatedErrors }, { status: 400 }))
   }

   const user = { nome, email, role }

   const token = jwt.sign(user, process.env.JWT_SECRET_KEY)

   jwt.verify()
   
   return new Response(JSON.stringify({ token, nome, email, senha, provider: "local" }), { status: 200 })
}