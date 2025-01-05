import { toast } from 'react-toastify'

export const notify = (message) => {

   toast.success(message, {
      theme: "colored",
      position: "top-center",
      autoClose: 2000
   })
}

export const notifyError = (message) => {

   toast.error(message, {
      theme: "colored",
      position: "top-center",
      autoClose: 2000
   })
}