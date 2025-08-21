import Input from "./Input";
import MessageUI from "./MessageUI";

function Chat() {
  return (
    <div className="w-[700px] flex flex-col gap-5">
        <MessageUI role="user" content="Hello, what can I ask you?" />
        <MessageUI role="assistant" content="Hi! I'm here to assist you with any questions you may have." />
        <Input />
    </div>
  )
}

export default Chat;