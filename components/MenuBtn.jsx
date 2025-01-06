const MenuBtn = ({ image, active, title, activeImage, handleClick, mobile = false }) => {

   const styles = {
      button: `
         flex gap-[1.5rem] justify-start items-center w-full rounded-[.4rem] p-[1rem]   
         ${mobile ? 'pl-[1rem]' : 'pl-[2rem]'} ${mobile && 'justify-center items-center'}
      `,
      title: "font-semibold text-[1.3rem]"
   }

   return (
      <li className={mobile ? "flex-1 min-w-0" : ""}>
         <button className={active ? styles.button + " bg-[#3b37ff]" : styles.button + " bg-transparent"} onClick={handleClick}>
            <img src={active ? activeImage : image} className="w-[2rem]" />
            { !mobile && <p className={active ? styles.title + " text-[#FFF]" : styles.title + " text-[#919190]"}>{title}</p> }
         </button>
      </li>
   )
}

export default MenuBtn