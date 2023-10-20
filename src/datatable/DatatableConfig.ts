import type {SortOrder} from "@/util/Dataset";
import type {Column} from "@/datatable/Column";

export interface DatatableConfig<E> {
    items: E[];
    columns: Column<E>[];
}

class DatatableConfigBuilder<E> {

    private columns: Column<E>[] = [];

    constructor(private items: E[]) {}

    public col(name: string, sortFn: (a: E, b: E) => number, sorting?: SortOrder): DatatableConfigBuilder<E> {
        this.columns.push({name, sortFn, sorting});
        return this;
    }

    public build(): DatatableConfig<E> {
        return {
            items: this.items,
            columns: this.columns,
        };
    }

}

export function datatable<E>(items: E[]): DatatableConfigBuilder<E> {
    return new DatatableConfigBuilder(items);
}

