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
    const { selectedChat, setSelectedChat, setCurrentChats, setCurrentMessages } = useContext(GlobalContext);

    // Local state for the input field value
    const [inputMessage, setInputMessage] = useState("");
    // Ref for aborting the assistant fetch request
    const abortControllerRef = useRef<AbortController | null>(null);
    // Ref for focusing the input field
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Handles form submission: creates chat/message, updates state, and triggers assistant
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage) return;

        let chatId = selectedChat;

        // If no chat is selected, create a new chat
        if (selectedChat === "") {
            const newChat = new Chat(new Date().toLocaleString());
            chatId = newChat.id;
            setSelectedChat(newChat.id);

            setCurrentChats(prev => {
                const updated = [...prev, newChat];
                localStorage.setItem("Chats", JSON.stringify(updated));
                return updated;
            });
        }

        // Add the user's message to the message list
        const newMessage = new Message(chatId, "user", inputMessage);
        setCurrentMessages(prev => {
            const updated = [...prev, newMessage];
            localStorage.setItem("Messages", JSON.stringify(updated));
            return updated;
        });

        // Set sending state and clear input
        setSending({state: true, message: inputMessage});
        setInputMessage("");
    }

    // Handles cancelling the assistant fetch request
    const handleCancel = () => {
        abortControllerRef.current?.abort();
        setSending({state: false, message: ""});
    }

    // Handles assistant fetch and message update when sending.state changes
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
                // Add assistant's response to the message list
                const message = new Message(selectedChat, "assistant", data.candidates[0].content.parts[0].text);
                setCurrentMessages(prev => {
                    const updated = [...prev, message];
                    localStorage.setItem("Messages", JSON.stringify(updated));
                    return updated;
                });

                setSending({state: false, message: ""});
            })
            .catch(err => {
                console.error(err);
                setSending({state: false, message: ""});
            });
        }

        // Cleanup: abort fetch on unmount or sending change
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [sending]);

    // Focus input when selected chat changes
    useEffect(() => {
        inputRef.current?.focus();
    }, [selectedChat]);

    return (
        <form className="flex flex-col mb-2 w-full" onSubmit={handleSubmit}>
            <div className="flex border border-gray-400 p-1.5 rounded-lg">            
                <input
                    className="outline-none w-full p-1"
                    type="text"
                    placeholder="Ask anything"
                    ref={inputRef}
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                />

                {/* Send button: hidden and disabled while sending */}
                <button
                    className={clsx("bg-[#FFF491] p-1 rounded-sm cursor-pointer", {"hidden": sending.state})}
                    disabled={sending.state}
                    type="submit"
                >
                    <img src="/send.svg" alt="Send icon" width={24} />
                </button>

                {/* Cancel button: shown while sending */}
                {sending.state && (
                    <button
                        className="bg-[#FFF491] p-1 rounded-sm cursor-pointer"
                        type="button"
                        onClick={handleCancel}
                    >
                        <img src="/stop.svg" alt="Stop icon" width={24} />
                    </button>
                )}
            </div>
            <span className="text-center">
                made by <a href="https://github.com/andrewsys" target="_blank" rel="noopener noreferrer" className="underline">github@andrewsys</a>
            </span>
        </form>
    )
}

export default Input;