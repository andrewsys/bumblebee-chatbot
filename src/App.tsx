import Chat from "./components/Chat";
import MiniChat from "./components/MiniChat";

function App() {
  return (
    <div className="flex h-screen font-outfit">
      <div className="border-r-1 border-gray-400 w-[300px] p-2">
        <h1 className="text-lg font-bold p-2">Bumble<h1 className="text-[#ffc400ff] inline">bee</h1> Chatbot</h1>
        <div className="flex w-full p-2 border-b-1 border-gray-400 font-medium">
          <h2>Chats</h2>
          <button className="bg-[#FFF491] hover:bg-[#FFF000] ml-auto px-2 rounded-sm cursor-pointer">+ New Chat</button>
        </div>
        <div className="my-2">
          {false ? 
            <span className="text-gray-500 px-2 py-1">No chats yet</span> : 
            <><MiniChat chat={{ id: "1", title: "Meaning of Life" }} />
            <MiniChat chat={{ id: "1", title: "Symbolism of the Bee" }} /></>}
        </div>
      </div>
      <div className="w-full flex justify-center items-end">
        <Chat />
      </div>
    </div>
  )
}

export default App;