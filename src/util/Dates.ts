import {DateTime} from "luxon";

export function dateComp(a: DateTime|number|null, b: DateTime|number|null): number {
    if (a === null && b === null) {
        return 0;
    } else if (a === null) {
        return -1;
    } else if (b === null) {
        return 1;
    } else {
        a = a instanceof DateTime ? a.toMillis() : a;
        b = b instanceof DateTime ? b.toMillis() : b;
        return a - b;
    }
}