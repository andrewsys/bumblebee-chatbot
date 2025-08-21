import { v4 as uuidv4 } from 'uuid';

class Message {
    chatId: string;
    id: string;
    role: string;
    content: string;

    constructor(chatId: string, role: string, content: string) {
        this.chatId = chatId;
        this.id = uuidv4();
        this.role = role;
        this.content = content;
    }
}

export default Message;