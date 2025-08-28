import { useContext, useEffect, useState, useRef } from "react";
import GlobalContext from "../utils/GlobalContext";
import Chat from "../utils/Chat";

function MobileHeader() {
    const { setMobileMenu, setSelectedChat, setCurrentChats, setCurrentMessages, selectedChat, currentChats } = useContext(GlobalContext);
    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const foundChat = currentChats.find((c: Chat) => c.id === selectedChat);
        setChat(foundChat);
    }, [currentChats, selectedChat]);

    const handleEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsEditing(true);
      inputRef.current?.focus();
      return;
    }

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputRef.current!.value) {
        const chats = JSON.parse(localStorage.getItem("Chats") || "[]");
        const updatedChats = chats.map((c: any) =>
          c.id === chat?.id ? { ...c, title: inputRef.current!.value } : c
        );
        localStorage.setItem("Chats", JSON.stringify(updatedChats));
        chat!.title = inputRef.current!.value;
      }
      setIsEditing(false);
      return;
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const chats = JSON.parse(localStorage.getItem("Chats") || "[]");
      const updatedChats = chats.filter((c: any) => c.id !== chat!.id);
      localStorage.setItem("Chats", JSON.stringify(updatedChats));

      const messages = JSON.parse(localStorage.getItem("Messages") || "[]");
      const updatedMessages = messages.filter((m: any) => m.chatId !== chat!.id);
      localStorage.setItem("Messages", JSON.stringify(updatedMessages));

      if (selectedChat === chat!.id) {
        setSelectedChat("");
      }

      // Reload list logic
      setCurrentChats(updatedChats);
      setCurrentMessages(updatedMessages);
    }

    return (
        <div className="lg:hidden absolute top-0 w-full h-[60px] bg-white flex items-center justify-between px-4 border-b-1 border-gray-400">
            <button onClick={() => setMobileMenu(true)}>
                <img src="/menu.svg" alt="Menu icon" width={30} />
            </button>
            {selectedChat == "" && <span className="text-xl font-bold px-2">Bumble<span className="text-[#ffc400ff] inline">bee</span></span>}
            {selectedChat !== "" && <div className="flex items-center gap-2">
                {!isEditing && <span className="text-xl font-medium px-2 truncate max-w-[40vw]">{chat?.title}</span>}
                {!isEditing && <div className="flex items-center gap-2">
                    <button onClick={handleEditButton}>
                        <img src="/pencil.svg" alt="Edit chat icon" width={26} />
                    </button>
                    <button onClick={handleDelete}>
                        <img src="/trash.svg" alt="Delete chat icon" width={26} />
                    </button>
                </div>}
                {isEditing && <form className="flex items-center"onSubmit={handleEditSubmit}>
                    <input type="text" ref={inputRef} defaultValue={chat?.title} className="self-center outline-1 px-2 mx-4 rounded-md py-0.5 w-full max-w-[40vw]" onClick={e => e.stopPropagation()} />
                    <div className="flex items-center gap-2">
                        <button type="submit">
                            <img src="/check.svg" alt="Confirm edit chat icon" width={24} />
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            <img src="/close.svg" alt="Cancel edit chat icon" width={24} />
                        </button>
                    </div>
                </form>}
            </div>}
            <button onClick={() => {setSelectedChat(""); setMobileMenu(false); setIsEditing(false);}}>
                <img src="/newchat.svg" alt="New chat icon" width={30} />
            </button>            
        </div>
    )
}

export default MobileHeader