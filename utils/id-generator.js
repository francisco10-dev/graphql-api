import { customAlphabet } from 'nanoid';
const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generatedId = customAlphabet(ALPHA,12);




