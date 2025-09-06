import { useContext, useEffect, useState, useRef } from "react";
import GlobalContext from "../utils/GlobalContext";
import Chat from "../utils/Chat";

function MobileHeader() {
    const { setMobileMenu, setSelectedChat, setCurrentChats, setCurrentMessages, selectedChat, currentChats } = useContext(GlobalContext);
    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    {/* update the local chat object whenever the selected chat or chat list changes */}
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
        {/* update chat title in localStorage */}
        const chats = JSON.parse(localStorage.getItem("Chats") || "[]");
        const updatedChats = chats.map((c: any) =>
          c.id === chat?.id ? { ...c, title: inputRef.current!.value } : c
        );
        localStorage.setItem("Chats", JSON.stringify(updatedChats));
        {/* update local chat object */}
        chat!.title = inputRef.current!.value;
      }
      setIsEditing(false);
      return;
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      {/* remove chat from localStorage */}
      const chats = JSON.parse(localStorage.getItem("Chats") || "[]");
      const updatedChats = chats.filter((c: any) => c.id !== chat!.id);
      localStorage.setItem("Chats", JSON.stringify(updatedChats));

      {/* remove all messages with this chatId from localStorage */}
      const messages = JSON.parse(localStorage.getItem("Messages") || "[]");
      const updatedMessages = messages.filter((m: any) => m.chatId !== chat!.id);
      localStorage.setItem("Messages", JSON.stringify(updatedMessages));

      {/* deselect chat if it was the one being deleted */}
      if (selectedChat === chat!.id) {
        setSelectedChat("");
      }

      {/* update global state so UI reflects changes immediately */}
      setCurrentChats(updatedChats);
      setCurrentMessages(updatedMessages);
    }

    return (
        <div className="lg:hidden absolute top-0 w-full h-[60px] bg-white flex items-center justify-between px-4 border-b-1 border-gray-400">
            {/* Menu button (left) */}
            <button onClick={() => setMobileMenu(true)}>
                <img src="/menu.svg" alt="Menu icon" width={30} />
            </button>
            {/* show app name if no chat is selected */}
            {selectedChat == "" && <span className="text-xl font-bold px-2">Bumble<span className="text-[#ffc400ff] inline">bee</span></span>}
            {/* show chat title and actions if a chat is selected */}
            {selectedChat !== "" && <div className="flex items-center gap-2">
                {/* show chat title if not editing */}
                {!isEditing && <span className="text-xl font-medium px-2 truncate max-w-[40vw]">{chat?.title}</span>}
                {/* edit and delete buttons */}
                {!isEditing && <div className="flex items-center gap-2">
                    <button onClick={handleEditButton}>
                        <img src="/pencil.svg" alt="Edit chat icon" width={26} />
                    </button>
                    <button onClick={handleDelete}>
                        <img src="/trash.svg" alt="Delete chat icon" width={26} />
                    </button>
                </div>}
                {/* input for chat title and confirm/cancel buttons (on edit) */}
                {isEditing && <form className="flex items-center" onSubmit={handleEditSubmit}>
                    <input
                        type="text"
                        ref={inputRef}
                        defaultValue={chat?.title}
                        className="self-center outline-1 px-2 mx-4 rounded-md py-0.5 w-full max-w-[40vw]"
                        onClick={e => e.stopPropagation()}
                    />
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
            {/* new chat button */}
            <button onClick={() => {setSelectedChat(""); setMobileMenu(false); setIsEditing(false);}}>
                <img src="/newchat.svg" alt="New chat icon" width={30} />
            </button>            
        </div>
    )
}

export default MobileHeader