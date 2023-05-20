import type {DateTime} from "luxon";

export const dateOptions: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
};

export const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit"
};

export const realtimeOptions: Intl.DateTimeFormatOptions = {
    hour: timeOptions.hour,
    minute: timeOptions.minute,
    second: "2-digit"
}

export function date(dt: DateTime): string {
    return dt.toLocaleString(dateOptions);
}

export function time(dt: DateTime): string {
    return dt.toLocaleString(timeOptions);
}

export function datetime(dt: DateTime): string {
    return date(dt) + " " + time(dt);
}

export function realtime(dt: DateTime): string {
    return dt.toLocaleString(realtimeOptions);
}
