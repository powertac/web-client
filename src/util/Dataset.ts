export enum SortOrder {
    ASC = 1,
    DESC = -1
}

export class Dataset<E> {

    private columns: string[] = [];
    private sorting: {[name: string]: SortOrder|undefined} = {};
    private orderFunctions: Map<string, (a: E, b: E) => number> = new Map();

    constructor(columns: {[name:string]: (a: E, b: E) => number},
                private _items: E[]) {
        Object.keys(columns).forEach((name) => {
            const orderFunction = columns[name];
            this.orderFunctions.set(name, orderFunction);
        });
    }

    public static create<T>(columns: {[name:string]: (a: T, b: T) => number}, items: T[]): Dataset<T> {
        return new Dataset<T>(columns, items);
    }

    get cols(): string[] {
        return this.columns.splice(0);
    }

    get items(): E[] {
        return this._items.sort(this.sortFn);
    }

    set items(items: E[]) {
        this._items = items;
    }

    public index(name: string): number|null {
        const index = this.columns.indexOf(name);
        return index > -1 ? index : null;
    }

    public order(name: string): SortOrder|null {
        const order = this.sorting[name];
        return order !== undefined ? order : null;
    }

    public orderBy(name: string, order: SortOrder): Dataset<E> {
        if (!this.columns.includes(name)) {
            this.columns.push(name);
        }
        this.sorting[name] = order;
        return this;
    }

    public remove(name: string): Dataset<E> {
        const index = this.columns.indexOf(name);
        this.columns.splice(index, 1);
        this.sorting[name] = undefined;
        return this;
    }

    public reset(): Dataset<E> {
        this.columns = [];
        this.sorting = {};
        return this;
    }

    public toggle(name: string): Dataset<E> {
        const order = this.order(name);
        if (null === order) {
            this.orderBy(name, SortOrder.ASC)
        } else if (SortOrder.ASC === order) {
            this.orderBy(name, SortOrder.DESC);
        } else {
            this.remove(name);
        }
        return this;
    }

    private get sortFn(): (a: E, b: E) => number {
        return (a, b) => {
            for (let i = 0; i < this.columns.length; i++) {
                const name = this.columns[i];
                const sorting = this.sorting[name];
                if (sorting !== undefined) {
                    const compare = this.orderFunctions.get(name);
                    if (compare !== undefined) {
                        const comparison = compare(a, b) * sorting.valueOf()
                        if (comparison !== 0) {
                            return comparison;
                        }
                    }
                } else {
                    throw new Error("no order defined for column " + name);
                }
            }
            return 0;
        }
    }

}
