import { Metadata } from "next"

import { ToastContainer } from "react-toastify"

import "./globals.css"

export const metadata: Metadata = {
   title: "AuthApp",
   description: "OpenID Auth Application"
}

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
   return (
      <html lang="pt-br">
         <body>
            { children }
            <ToastContainer />
         </body>
      </html>
   )
}

export default layout