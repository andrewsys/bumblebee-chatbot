import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";

interface Props {
    role: string;
    content: string;
    isLoader?: boolean;
}

function MessageUI({role, content, isLoader}: Props) {
    return (
        <div 
            className={clsx(
                "max-w-[75vw] md:max-w-[600px] p-2 mb-5 rounded-xl",
                {
                    "self-start bg-[#E5E5E5]": role === "assistant",
                    "self-end bg-[#FFF491] mr-2": role === "user"
                }
            )}
        >
            {/* render message content */}
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            {/* show loader animation when loading */}
            {isLoader && <div className="loader"></div>}
        </div>
    )
}

export default MessageUI;