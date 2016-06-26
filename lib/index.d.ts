import { Stream } from 'most';
import { SubjectSource } from './SubjectSource';
export { SubjectSource };
export declare function subject<T>(): Subject<T>;
export declare function holdSubject<T>(bufferSize?: number): Subject<T>;
export declare class Subject<T> extends Stream<T> {
    constructor(source: SubjectSource<T>);
    next(value: T): void;
    error(err: Error): void;
    complete(value: T): void;
}
