const ListItem = ({ label, value }) => {
   return (
      <li className="mt-[.3rem]">
         <p className="text-[1.3rem]"><b>{label}</b>: {value}</p>
      </li>
   )
}

const User = ({ loginData }) => {
   return (
      <div className="p-[4rem]">

         <h2 className="font-bold text-[3rem]">{loginData.nome}</h2>

         <ul className="mt-[2rem]">
            <ListItem label="Email" value={loginData.email} />
            <ListItem label="Role" value={loginData.role} />
            <ListItem label="Provider" value={loginData.provider} />
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