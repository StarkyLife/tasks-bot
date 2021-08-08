import { Message } from './message';
import { Parser } from './parser';

const regexpAndMessageTypes: Array<{ regexp: RegExp; type: Message['type'] }> = [
    {
        regexp: /^План/,
        type: 'task_plan',
    }, {
        regexp: /^Факт/,
        type: 'task_fact',
    },
];

export const parseTasks: Parser = (text) => {
    const matching = regexpAndMessageTypes.find(({ regexp }) => text.match(regexp));

    return matching
        ? { text, type: matching.type }
        : null;
};
