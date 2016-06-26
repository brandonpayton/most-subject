import { Source, Sink, Scheduler, Disposable } from 'most';
export interface SubjectSource<T> extends Source<T> {
    next: (value: T) => void;
    error: (err: Error) => void;
    complete: (value?: T) => void;
}
export declare class BasicSubjectSource<T> implements SubjectSource<T> {
    protected scheduler: Scheduler;
    protected sinks: Sink<T>[];
    protected active: boolean;
    run(sink: Sink<T>, scheduler: Scheduler): Disposable<T>;
    protected add(sink: Sink<T>): number;
    remove(sink: Sink<T>): number;
    _dispose(): void;
    next(value: T): void;
    error(err: Error): void;
    complete(value?: T): void;
    protected _next(time: number, value: T): void;
    protected _complete(time: number, value: T): void;
    protected _error(time: number, err: Error): void;
}
