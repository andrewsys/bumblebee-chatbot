import { useContext, useState, useRef } from "react";
import Chat from "../utils/Chat";
import GlobalContext from "../utils/GlobalContext";

interface Props {
  chat: Chat;
}

function MiniChat({ chat }: Props) {
    const { selectedChat, setSelectedChat, setMobileMenu, setCurrentChats, setCurrentMessages } = useContext(GlobalContext);
    const [isHovering, setIsHovering] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsEditing(true);
      return;
    }

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputRef.current!.value) {
        const chats = JSON.parse(localStorage.getItem("Chats") || "[]");
        const updatedChats = chats.map((c: any) =>
          c.id === chat.id ? { ...c, title: inputRef.current!.value } : c
        );
        localStorage.setItem("Chats", JSON.stringify(updatedChats));
        chat.title = inputRef.current!.value;
      }
      setIsEditing(false);
      return;
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const chats = JSON.parse(localStorage.getItem("Chats") || "[]");
      const updatedChats = chats.filter((c: any) => c.id !== chat.id);
      localStorage.setItem("Chats", JSON.stringify(updatedChats));

      const messages = JSON.parse(localStorage.getItem("Messages") || "[]");
      const updatedMessages = messages.filter((m: any) => m.chatId !== chat.id);
      localStorage.setItem("Messages", JSON.stringify(updatedMessages));

      if (selectedChat === chat.id) {
        setSelectedChat("");
      }

      // Reload list logic
      setCurrentChats(updatedChats);
      setCurrentMessages(updatedMessages);
    }

    return (
    <div className="w-full hover:bg-gray-200 cursor-pointer rounded-md px-2 py-1 flex justify-between items-center" onClick={() => {if (!isEditing) {setSelectedChat(chat.id); setMobileMenu(false);}}} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {!isEditing && <span className="py-0.5 truncate break-all lg:max-w-[200px]">{chat.title}</span>}
        {isEditing && <form className="flex justify-between w-full gap-2" onSubmit={handleEditSubmit}>
          <input type="text" ref={inputRef} defaultValue={chat.title} className="self-start outline-1 px-2 rounded-md py-0.5 w-full" onClick={e => e.stopPropagation()}/>
          <button className="hover:bg-gray-300 p-1 rounded-md cursor-pointer min-w-[26px]" type="submit">
            <img src="check.svg" alt="Confirm rename chat button" width={18} height={18}/>
          </button>
          <button className="hover:bg-gray-300 p-1 rounded-md cursor-pointer min-w-[26px]" onClick={() => setIsEditing(false)}>
            <img src="close.svg" alt="Cancel rename chat button" width={18} height={18}/>
          </button>
        </form>}
        {isHovering && !isEditing && <div className="flex items-center gap-2">
          <button className="hover:bg-gray-300 p-1 rounded-md cursor-pointer" onClick={handleEditButton}>
            <img src="pencil.svg" alt="Rename chat button" width={18} height={18}/>
          </button>
          <button className="hover:bg-gray-300 p-1 rounded-md cursor-pointer" onClick={handleDelete}>
            <img src="trash.svg" alt="Delete chat button" width={18} height={18}/>
          </button>
        </div>}
    </div>
    )
}

export default MiniChat;