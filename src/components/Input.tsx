import { useEffect, useState, useRef } from "react";
import Message from "../utils/Message";

function Input() {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [inputMessage, setInputMessage] = useState("");
    const [sending, setSending] = useState({state: false, message: ""});
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage) return;

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
                const message = new Message("", "assistant", data.candidates[0].content.parts[0].text);
                console.log(message);

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
        <form className="border border-gray-400 p-1.5 mb-5 rounded-lg flex max-w-[700px]" onSubmit={handleSubmit}>
            <input className="outline-none w-full p-1" type="text" placeholder="Ask anything" value={inputMessage} onChange={e => setInputMessage(e.target.value)} />

            {!sending.state && <button className="bg-[#FFF491] p-1 rounded-sm cursor-pointer" type="submit">
                <img src="/send.svg" alt="Send icon" width={24} />
            </button>}

            {sending.state && <button className="bg-[#FFF491] p-1 rounded-sm cursor-pointer" type="button" onClick={handleCancel}>
                <img src="/stop.svg" alt="Stop icon" width={24} />
            </button>}
        </form>
    )
}

export default Input;