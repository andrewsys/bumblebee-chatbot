import { useContext } from "react";
import Chat from "../utils/Chat";
import GlobalContext from "../utils/GlobalContext";

interface Props {
  chat: Chat;
}

function MiniChat({ chat }: Props) {
    const { setSelectedChat } = useContext(GlobalContext);

    return (
    <div className="w-full hover:bg-gray-200 cursor-pointer rounded-md px-2 py-1" onClick={() => setSelectedChat(chat.id)}>
        <span>{chat.title}</span>
    </div>
    )
}

export default MiniChat;