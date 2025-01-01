const page = () => {
   return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-[1.5rem]">

         <h1 className="font-bold text-[2.5rem]">Welcome! You're in FREE route 🥳</h1>

         <a href="/home">
            <button className="bg-[#3b37ff] text-white font-semibold text-[1.4rem] p-[1rem] rounded-[.4rem]">Go back</button>
         </a>
         
      </div>
   )
}

export default page