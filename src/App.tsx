import { useEffect, useState } from "react";

import GlobalContext from "./utils/GlobalContext";
import ChatUI from "./components/ChatUI";
import MiniChat from "./components/MiniChat";
import Chat from "./utils/Chat";

function App() {
  // const [storageMessages, setStorageMessages] = useState("");
  // const [storageChats, setStorageChats] = useState("");
  const [selectedChat, setSelectedChat] = useState("");

  const [currentChats, setCurrentChats] = useState<Chat[]>(JSON.parse(localStorage.getItem("Chats") || "[]"));

  useEffect(() => {
    setCurrentChats(JSON.parse(localStorage.getItem("Chats") || "[]"));
    console.log("(App.tsx) Selected chat:", selectedChat);
  }, [selectedChat]);

  return (
    <GlobalContext.Provider value={{ selectedChat, setSelectedChat }}>
      <div className="flex h-screen font-outfit">
        <div className="border-r-1 border-gray-400 w-[300px] p-2">
          <span className="text-lg font-bold p-2">Bumble<span className="text-[#ffc400ff] inline">bee</span> Chatbot</span>
          <div className="flex w-full p-2 border-b-1 border-gray-400 font-medium">
            <span>Chats</span>
            <button className="bg-[#FFF491] hover:bg-[#FFF000] ml-auto px-2 rounded-sm cursor-pointer" onClick={() => setSelectedChat("")}>+ New Chat</button>
          </div>
          <div className="my-2">
            {!currentChats.length ? 
              <span className="text-gray-500 px-2 py-1">No chats yet</span> 
              : currentChats.map((chat: Chat) => (
                <MiniChat key={chat.id} chat={chat} />
              ))
            }
          </div>
        </div>
        <div className="w-full flex justify-center items-end">
          <ChatUI />
        </div>
      </div>
    </GlobalContext.Provider>
  )
}

export default App;