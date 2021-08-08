import { Message } from './message';
import { parseTasks } from './tasks-parser';

it('should return `null` given unknown format', () => {
    expect(parseTasks('unknown')).toEqual(null);
});

it.each<[string, Message['type']]>([
    ['План ...', 'task_plan'],
    ['Факт ...', 'task_fact'],
])('should parse task plan text', (messageText, messageType) => {
    expect(parseTasks(messageText)).toEqual<Message>({
        text: messageText,
        type: messageType,
    });
});
