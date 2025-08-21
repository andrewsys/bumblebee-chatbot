import Chat from "../utils/Chat";

interface Props {
  chat: Chat;
}

function MiniChat({ chat }: Props) {
  return (
    <div className="w-full hover:bg-gray-200 cursor-pointer rounded-md px-2 py-1">
      <span>{chat.title}</span>
    </div>
  )
}

export default MiniChat;