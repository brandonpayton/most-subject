import { Sink } from 'most';
import { BasicSubjectSource } from './SubjectSource';
export interface SubjectEvent<T> {
    time: number;
    value: T;
}
export declare class HoldSubjectSource<T> extends BasicSubjectSource<T> {
    protected bufferSize: number;
    protected buffer: SubjectEvent<T>[];
    constructor(bufferSize: number);
    add(sink: Sink<T>): number;
    next(value: T): void;
}
