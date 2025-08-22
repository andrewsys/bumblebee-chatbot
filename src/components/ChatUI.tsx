import { useState, useContext, useEffect } from "react";
import Input from "./Input";
import GlobalContext from "../utils/GlobalContext";
import Message from "../utils/Message";
import MessageUI from "./MessageUI";

function ChatUI() {
  const { selectedChat } = useContext(GlobalContext);
  const [messages, setMessages] = useState<Message[]>(JSON.parse(localStorage.getItem("Messages") || "[]").filter(
    (msg: { chatId: string }) => msg.chatId === selectedChat
  ));
  const [sending, setSending] = useState({ state: false, message: "" });

  useEffect(() => {
    setMessages(JSON.parse(localStorage.getItem("Messages") || "[]").filter(
      (msg: { chatId: string }) => msg.chatId === selectedChat
    ));
    console.log("(ChatUI.tsx) Selected chat:", selectedChat);
  }, [sending, selectedChat]);

  return (
    <div>
      <div className="w-[700px] flex flex-col gap-5 overflow-y-auto h-full">
        {messages.map((msg, index) => (
          <MessageUI key={index} role={msg.role} content={msg.content} />
        ))}
        <Input sending={sending} setSending={setSending} />
      </div>
    </div>
  )
}

export default ChatUI;