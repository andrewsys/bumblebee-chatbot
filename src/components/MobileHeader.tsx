import { useContext } from "react";
import GlobalContext from "../utils/GlobalContext";

function MobileHeader() {
    const { setMobileMenu, setSelectedChat } = useContext(GlobalContext);
    return (
        <div className="lg:hidden absolute top-0 w-full h-[60px] bg-white flex items-center justify-between px-4 border-b-1 border-gray-400">
            <button onClick={() => setMobileMenu(true)}>
                <img src="/menu.svg" alt="Menu icon" width={30} />
            </button>
            <span className="text-xl font-bold px-2">Bumble<span className="text-[#ffc400ff] inline">bee</span></span>
            <button onClick={() => {setSelectedChat(""); setMobileMenu(false);}}>
                <img src="/newchat.svg" alt="New chat icon" width={30} />
            </button>
        </div>
    )
}

export default MobileHeader