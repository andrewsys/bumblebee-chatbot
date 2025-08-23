import { useState, useContext, useEffect, useRef } from "react";
import Input from "./Input";
import GlobalContext from "../utils/GlobalContext";
import Message from "../utils/Message";
import MessageUI from "./MessageUI";
import MobileHeader from "./MobileHeader";

function ChatUI() {
  const { selectedChat } = useContext(GlobalContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="h-screen min-h-0 flex flex-col">
      <MobileHeader />
      <div className="w-screen lg:w-[700px] px-4 lg:px-0 flex flex-col flex-1 min-h-0">
        <div className="flex flex-col overflow-y-auto flex-1 pt-20 lg:pt-5">
          {messages.map((msg, index) => (
            <MessageUI key={index} role={msg.role} content={msg.content} />
          ))}
          {sending.state && <MessageUI role="assistant" content="" isLoader={true} />}
          <div ref={messagesEndRef} />
        </div>
        <Input sending={sending} setSending={setSending} />
      </div>
    </div>
  )
}

export default ChatUI;