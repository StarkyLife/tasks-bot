import { Message } from './message';
import { MessagesGateway } from './messages-gateway';

export class InMemoryMessagesGateway implements MessagesGateway {
    messages: Message[] = [];

    async save(message: Message) {
        this.messages.push(message);
    }
}
