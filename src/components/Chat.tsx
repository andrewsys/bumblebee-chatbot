import Input from "./Input";
import Message from "./Message";

function Chat() {
  return (
    <div className="w-[700px] flex flex-col gap-5">
        <Message role="assistant" content="Hello! How can I assist you today?" />
        <Message role="user" content="What is the weather like today?" />
        <Message role="assistant" content="The weather is sunny with a high of 25°C." />
        <Message role="user" content="Can you tell me a joke?" />
        <Message role="assistant" content="Why did the scarecrow win an award? Because he was outstanding in his field! Ahahahahhaha" />
        <Input />
    </div>
  )
}

export default Chat;