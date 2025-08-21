import Markdown from "react-markdown";
import clsx from "clsx";

interface Props {
    role: string;
    content: string;
}

function MessageUI({role, content}: Props) {
    return (
        <div 
            className={clsx("max-w-[600px] p-2 rounded-xl", {
                "self-start bg-[#E5E5E5]": role === "assistant",
                "self-end bg-[#FFF491]": role === "user"}
            )}
        >
            <Markdown>{content}</Markdown>
        </div>
    )
}

export default MessageUI;