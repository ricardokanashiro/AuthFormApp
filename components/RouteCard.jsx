const RouteCard = ({ image, title, description, action, active }) => {

   const estilo = "shadow-custom bg-white lg:w-[27rem] flex p-[2rem] rounded-[1rem] gap-[2rem] w-full min-w-[20rem] h-full"

   return (
      <a href={active ? action : "/home"} className="flex-1 lg:grow-0">

         <div className={active ? estilo + " cursor-pointer" : estilo + " opacity-[0.5] cursor-default"}>

            <div className="bg-[#3b37ff] w-[4.5rem] h-[4.5rem] flex justify-center items-center rounded-[1rem] shrink-0">
               <img src={image} className="w-[2.7rem]" />
            </div>

            <div>
               <h3 className="font-semibold text-[1.5rem]">{title}</h3>
               <p className="mt-[.5rem]">{description}</p>
            </div>

         </div>

      </a>

   )
}

export default RouteCard