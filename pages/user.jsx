const ListItem = ({ label, value }) => {
   return (
      <li className="mt-[.3rem]">
         <p className="text-[1.3rem]"><b>{label}</b>: {value}</p>
      </li>
   )
}

const User = () => {
   return (
      <div className="p-[4rem]">

         <h2 className="font-bold text-[3rem]">Ricardo Kanashiro</h2>

         <ul className="mt-[2rem]">
            <ListItem label="Email" value="ricardo@gmail.com" />
            <ListItem label="Role" value="user" />
            <ListItem label="Provider" value="local" />
         </ul>

         <p className="mt-[3rem] mb-[2rem] font-medium text-[#919190] text-[1.5rem]">Actions</p>

         <button className="flex gap-[1rem] justify-center items-center bg-[#3b37ff] p-[1rem] rounded-[.4rem]">
            <img src="/icon-trash.svg" alt="delete icon" className="w-[1.4rem]" />
            <p className="text-white font-medium text-[1.1rem]">Deletar conta</p>
         </button>

      </div>
   )
}

export default User