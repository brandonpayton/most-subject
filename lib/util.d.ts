import { Sink } from 'most';
import { SubjectEvent } from './HoldSubjectSource';
export declare function tryEvent<T>(t: number, x: T, sink: Sink<T>): void;
export declare function tryEnd<T>(t: number, x: T, sink: Sink<T>): void;
export declare function pushEvents<T>(buffer: any[], sink: Sink<T>): void;
export declare function dropAndAppend<T>(event: SubjectEvent<T>, buffer: SubjectEvent<T>[], bufferSize: number): SubjectEvent<T>[];
export declare function append<T>(x: T, a: T[]): T[];
export declare function remove<T>(i: number, a: T[]): T[];
export declare function findIndex<T>(x: T, a: T[]): number;
