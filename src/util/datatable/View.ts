import type {DateTime} from "luxon";
import {dateComp} from "@/util/Dates";

export enum Align {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

interface FieldOptions<T> {
    formatFn?: (e:T) => string;
    align?: Align,
    classes?: string[];
}

export interface Field<E,T> extends FieldOptions<T>{
    name: string;
    accessFn: (e:E) => T;
    compareFn?: (a:T, b:T) => number;
}

export class View<E> {

    public readonly fields: Field<E, any>[] = [];
    private sequence: string[] = [];
    private reverse: Set<string> = new Set<string>();

    public add<T>(field: Field<E, T>): View<E> {
        if (!this.has(field.name)) {
            this.fields.push(field);
            return this;
        } else {
            throw Error(`field with name ${field.name} already exists`);
        }
    }

    public field<T>(name: string,
                    accessFn: (e:E) => T,
                    compareFn?: (a:T, b:T) => number,
                    options?: FieldOptions<T>): View<E> {
        return this.add({name, accessFn, compareFn, ...options});
    }

    public get isAdditive() {
        return this.sequence.length > 1;
    }

    public orderBy(name: string, reverse = false): View<E> {
        const field = this.get(name);
        if (field !== undefined && field.compareFn !== undefined) {
            if (!this.sequence.includes(name)) {
                this.sequence.push(name);
            }
            if (reverse) {
                this.reverse.add(name);
            }
            return this;
        } else {
            throw new Error(`missing field or compareFn for name '${name}'`);
        }
    }

    public toggle(name: string, additive: boolean = false): void {
        const field = this.get(name);
        if (field !== undefined && field.compareFn !== undefined) {
            if (!additive) {
                this.sequence = [name];
            } else if (!this.sequence.includes(name)) {
                this.sequence.push(name);
            }
            const reverse = this.reverse.has(name);
            if (!additive) {
                this.reverse.clear();
            }
            if (!reverse) {
                this.reverse.add(name);
            } else {
                this.reverse.delete(name);
            }
        } else {
            throw new Error(`missing field or compareFn for name '${name}'`);
        }
    }

    public index(name: string): number|undefined {
        return this.sequence.includes(name) ? this.sequence.indexOf(name) : undefined;
    }

    public isReverse(name: string): boolean|undefined {
        return this.sequence.includes(name) ? this.reverse.has(name) : undefined;
    }

    public sort(items: E[]): E[] {
        return items.slice().sort(this.compareFn);
    }

    private has(name: string): boolean {
        return this.get(name) !== undefined;
    }

    private get(name: string): Field<E, any>|undefined {
        return this.fields.find(f => f.name === name);
    }

    private get compareFn(): (a: E, b: E) => number {
        return (a, b) => {
            for (let i = 0; i < this.sequence.length; i++) {
                const name = this.sequence[i];
                const field = this.get(name);
                if (field !== undefined) {
                    if (field.compareFn !== undefined) {
                        const result = field.compareFn(field.accessFn(a), field.accessFn(b));
                        if (result !== 0) {
                            const reverse = this.reverse.has(name);
                            return result * (reverse ? -1 : 1);
                        }
                    } else {
                        throw Error(`missing compareFn for field '${name}'`);
                    }
                } else {
                    throw Error(`unknown field '${name}'`);
                }
            }
            return 0;
        }
    }

}

export class Compare {

    private constructor() {}

    static get string(): (a: string, b: string) => number {
        return (a, b) => a.localeCompare(b);
    }

    static get number(): (a: number, b: number) => number {
        return (a, b) => a - b;
    }

    static get boolean(): (a: boolean, b: boolean) => number {
        return (a, b) => a && !b ? -1 : (!a && b) ? 1 : 0;
    }

    static get date(): (a: DateTime|null, b: DateTime|null) => number {
        return dateComp;
    }

}

export class Format {

    private constructor() {}

    public static defaultTo<T>(formatFn: (a: T) => string, def: string): (a: T|null|undefined) => string {
        return (a: T|undefined|null) => a !== undefined && a !== null ? formatFn(a) : def;
    }

}

