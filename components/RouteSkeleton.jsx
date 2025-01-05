import Skeleton from "@mui/material/Skeleton"

const RouteSkeleton = () => {
   return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-[2rem]">
         <Skeleton variant="rectangular" width={580} height={40} />
         <Skeleton variant="rectangular" width={100} height={40} />
      </div>
   )
}

export default RouteSkeleton