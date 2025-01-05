import Skeleton from "@mui/material/Skeleton"

const SelectRoleSkeleton = () => {
   return (
      <div className="w-full h-full flex justify-center items-center gap-[5rem]">
         <Skeleton variant="rectangular" width={330} height={380} />
      </div>
   )
}

export default SelectRoleSkeleton