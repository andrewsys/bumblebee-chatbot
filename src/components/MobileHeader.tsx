import { useContext, useEffect, useState } from "react";
import GlobalContext from "../utils/GlobalContext";
import Chat from "../utils/Chat";

function MobileHeader() {
    const { setMobileMenu, setSelectedChat, selectedChat, currentChats } = useContext(GlobalContext);
    const [chat, setChat] = useState<Chat | undefined>(undefined);

    useEffect(() => {
        const foundChat = currentChats.find((c: Chat) => c.id === selectedChat);
        setChat(foundChat);
    }, [currentChats, selectedChat]);

    return (
        <div className="lg:hidden absolute top-0 w-full h-[60px] bg-white flex items-center justify-between px-4 border-b-1 border-gray-400">
            <button onClick={() => setMobileMenu(true)}>
                <img src="/menu.svg" alt="Menu icon" width={30} />
            </button>
            {selectedChat == "" ? <span className="text-xl font-bold px-2">Bumble<span className="text-[#ffc400ff] inline">bee</span></span> : chat?.title}
            <button onClick={() => {setSelectedChat(""); setMobileMenu(false);}}>
                <img src="/newchat.svg" alt="New chat icon" width={30} />
            </button>
        </div>
    )
}

export default MobileHeader