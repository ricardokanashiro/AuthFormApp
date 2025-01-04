import Skeleton from "@mui/material/Skeleton"

const HomeSkeleton = () => {

   return (
      <div className="w-full h-full flex justify-center items-center gap-[5rem]">

         <Skeleton variant="rectangular" width={200} height="100%" />

         <div className="flex flex-col h-full flex-1 pt-[5rem]">

            <Skeleton variant="rectangular" width="50%" height={40} />

            <div className="flex gap-[2rem] mt-[4rem]">
               <Skeleton variant="rectangular" width={250} height={60} />
               <Skeleton variant="rectangular" width={250} height={60} />
            </div>

         </div>

      </div>
   )
}

export default HomeSkeleton