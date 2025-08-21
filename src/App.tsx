import Chat from './components/Chat';

function App() {
  return (
    <div className="flex h-screen">
      <div className="border-r-1 border-gray-400 w-[300px]">

      </div>
      <div className="w-full flex justify-center items-end">
        <Chat />
      </div>
    </div>
  )
}

export default App;