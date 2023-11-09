export function filename(path: string): string {
    return (path.split('\\').pop() as string).split('/').pop() as string;
}