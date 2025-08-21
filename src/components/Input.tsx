import { useEffect, useState, useRef } from "react";

function Input() {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [question, setQuestion] = useState("");
    const [sending, setSending] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;
        setSending(true);
    }

    const handleCancel = () => {
        abortControllerRef.current?.abort();
        setSending(false);
    }

    useEffect(() => {
        if (sending) {
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
                        "text": question
                        }
                    ]
                    }
                ]
                }),
                signal: controller.signal
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setQuestion("");
                setSending(false);
            })
            .catch(err => {
                console.error(err);
                setSending(false);
            });
        }

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [sending]);

    return (
        <form className="border border-gray-400 p-1.5 mb-5 rounded-lg flex max-w-[700px]" onSubmit={handleSubmit}>
            <input className="outline-none w-full p-1" type="text" placeholder="Ask anything" value={question} onChange={e => setQuestion(e.target.value)} />

            {!sending && <button className="bg-[#CDE9FF] p-1 rounded-sm cursor-pointer" type="submit">
                <img src="/send.svg" alt="Send icon" width={24} />
            </button>}

            {sending && <button className="bg-[#CDE9FF] p-1 rounded-sm cursor-pointer" type="button" onClick={handleCancel}>
                <img src="/stop.svg" alt="Stop icon" width={24} />
            </button>}
        </form>
    )
}

export default Input;