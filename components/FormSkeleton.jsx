import Skeleton from "@mui/material/Skeleton"

const FormSkeleton = () => {
   return (
      <div className="w-full h-full flex justify-center items-center gap-[10%]">

         <Skeleton variant="rectangular" width="35%" height="70%" />

         <div className="w-[35%] h-[70%] flex flex-col items-center justify-between">

            <div className="w-full flex flex-col items-center">
               <Skeleton variant="rectangular" width="80%" height={40} />
               <Skeleton variant="rectangular" width="100%" height={15} sx={{ marginTop: '15px' }} />
            </div>

            <div className="w-full">
               <Skeleton variant="rectangular" width="100%" height={40} />
               <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginTop: '20px' }} />
               <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginTop: '20px' }} />
            </div>

            <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginTop: '20px' }} />

         </div>

      </div>
   )
}

export default FormSkeleton