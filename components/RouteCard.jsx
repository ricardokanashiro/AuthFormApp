const RouteCard = ({ image, title, description }) => {
   return (
      <div className="shadow-custom bg-white w-[27rem] flex p-[2rem] rounded-[1rem] gap-[2rem] cursor-pointer">

         <div className="bg-[#3b37ff] w-[4.5rem] h-[4.5rem] flex justify-center items-center rounded-[1rem] shrink-0">
            <img src={image} className="w-[2.7rem]" />
         </div>

         <div>
            <h3 className="font-semibold text-[1.5rem]">{title}</h3>
            <p className="mt-[.5rem]">{description}</p>
         </div>

      </div>
   )
}

export default RouteCard