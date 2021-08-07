import { Message } from './message';

export interface Parser {
    (text: string): Message | null;
}
