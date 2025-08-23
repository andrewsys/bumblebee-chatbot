import { createContext } from "react";
import Chat from "./Chat";
import Message from "./Message";

export interface GlobalContextType {
    setMobileMenu: (open: boolean) => void;
    setSelectedChat: (id: string) => void;
    setCurrentMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setCurrentChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    selectedChat: string;
    currentChats: Chat[];
}

const GlobalContext = createContext<GlobalContextType>({
    setMobileMenu: () => {},
    setSelectedChat: () => {},
    setCurrentMessages: () => {},
    setCurrentChats: () => {},
    selectedChat: "",
    currentChats: [],
});
export default GlobalContext;