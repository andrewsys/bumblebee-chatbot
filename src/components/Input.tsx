import { useEffect, useState, useRef, useContext } from "react";
import clsx from "clsx";
import GlobalContext from "../utils/GlobalContext";
import Chat from "../utils/Chat";
import Message from "../utils/Message";

interface Props {
    sending: { state: boolean; message: string };
    setSending: React.Dispatch<React.SetStateAction<{ state: boolean; message: string }>>;
}

function Input({ sending, setSending }: Props) {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const { selectedChat, setSelectedChat } = useContext(GlobalContext);

    const [currentChats, setCurrentChats] = useState<Chat[]>(JSON.parse(localStorage.getItem("Chats") || "[]"));
    const [currentMessages, setCurrentMessages] = useState<Message[]>(JSON.parse(localStorage.getItem("Messages") || "[]"));

    const [inputMessage, setInputMessage] = useState("");
    // const [sending, setSending] = useState({state: false, message: ""});
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage) return;

        let chatId = selectedChat;

        if (selectedChat === "") {
            const newChat = new Chat(Date.now().toString());
            chatId = newChat.id;
            setSelectedChat(newChat.id);

            setCurrentChats(prev => [...prev, newChat]);
            localStorage.setItem("Chats", JSON.stringify([...currentChats, newChat]));
        }

        const newMessage = new Message(chatId, "user", inputMessage);
        setCurrentMessages(prev => [...prev, newMessage]);
        localStorage.setItem("Messages", JSON.stringify([...currentMessages, newMessage]));

        setSending({state: true, message: inputMessage});
        setInputMessage("");
    }

    const handleCancel = () => {
        abortControllerRef.current?.abort();
        setSending({state: false, message: ""});
    }

    useEffect(() => {
        if (sending.state) {
            const controller = new AbortController();
            abortControllerRef.current = controller;

            fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
                method: 'POST',
                headers: {
                'x-goog-api-key': API_KEY,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text": sending.message
                            }
                        ]
                    }
                ]
                }),
                signal: controller.signal
            })
            .then(res => res.json())
            .then(data => {
                const message = new Message(selectedChat, "assistant", data.candidates[0].content.parts[0].text);
                setCurrentMessages(prev => [...prev, message]);
                localStorage.setItem("Messages", JSON.stringify([...currentMessages, message]));

                setSending({state: false, message: ""});
            })
            .catch(err => {
                console.error(err);
                setSending({state: false, message: ""});
            });
        }

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [sending]);

    return (
        <form className="border border-gray-400 p-1.5 mb-5 rounded-lg flex w-full" onSubmit={handleSubmit}>
            <input className="outline-none w-full p-1" type="text" placeholder="Ask anything" value={inputMessage} onChange={e => setInputMessage(e.target.value)} />

            <button className={clsx("bg-[#FFF491] p-1 rounded-sm cursor-pointer", {"hidden": sending.state})} disabled={sending.state} type="submit">
                <img src="/send.svg" alt="Send icon" width={24} />
            </button>

            {sending.state && <button className="bg-[#FFF491] p-1 rounded-sm cursor-pointer" type="button" onClick={handleCancel}>
                <img src="/stop.svg" alt="Stop icon" width={24} />
            </button>}
        </form>
    )
}

export default Input;