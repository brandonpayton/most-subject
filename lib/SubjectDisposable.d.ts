import { Sink, Disposable } from 'most';
import { BasicSubjectSource } from './SubjectSource';
export declare class SubjectDisposable<T> implements Disposable<T> {
    private source;
    private sink;
    private disposed;
    constructor(source: BasicSubjectSource<T>, sink: Sink<T>);
    dispose(): void;
}
