import type {SortOrder} from "@/util/Dataset";

export interface Column<E> {
    name: string;
    sortFn: (a: E, b: E) => number;
    sorting?: SortOrder;
    classes?: {[name: string]: boolean};
}