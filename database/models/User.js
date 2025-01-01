import mongoose from "../setup.js"

const userSchema = new mongoose.Schema({
   nome: { type: String, required: true },
   email: { type: String, required: true },
   senha: { type: String, default: null },
   role: { type: String, enum: ["adm", "user"], required: true },
   provider: { type: String, enum: ["google", "local"], default: "local" }
})

userSchema.path("senha").validate(function(value) {

   if (this.provider === "local" && (!value || value.length === 0)) {
      throw new Error("PASSWORD_REQUIRED")
   }

   if(value && value.length > 60) {
      throw new Error("PASSWORD_TOO_LONG")
   }

   return true

}, "Erro de validação da senha!")

userSchema.path("email").validate(function(value) {

   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

   if(!emailRegex.test(value)) {
      throw new Error("NOT_AN_EMAIL")
   }

   return true

}, "Erro na validação de email!")

userSchema.index({ email: 1, provider: 1 }, { unique: true })

export const User = mongoose.models.User || mongoose.model('User', userSchema)