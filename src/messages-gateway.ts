import { Message } from './message';

export interface MessagesGateway {
    save(message: Message): Promise<void>;
}
