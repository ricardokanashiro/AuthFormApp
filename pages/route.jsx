import RouteCard from "../components/RouteCard"

const Route = ({ loginData }) => {
   return (
      <div className="w-full h-full p-[4rem]">

         <h1 className="font-bold text-[3rem]">Bem Vindo {loginData.nome}!</h1>

         <div className="mt-[4rem]">

            <p className="text-[#919190] font-medium text-[1.5rem] mb-[2rem]">ROTAS</p>

            <div className="flex gap-[2rem]">

               <RouteCard 
                  image="/unlock.svg"
                  title="Rota Livre"
                  description="Rota permitida para todos os usuários" 
               />

               <RouteCard 
                  image="/shield-security.svg" 
                  title="Rota Protegida" 
                  description="Rota permitida apenas para administradores" 
               />

            </div>

         </div>

      </div>
   )
}

export default Route