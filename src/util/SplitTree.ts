export class SplitTree {

    protected children: (SplitTree|string)[];

    private constructor(str: string, private separator: string|null) {
        this.children = separator !== null ? str.split(separator) : [str];
    }

    public static create(str: string): SplitTree {
        return new SplitTree(str, null);
    }

    public split(separator: string): void {
        if (this.separator !== null && separator.includes(this.separator)) {
            this.rebuild(separator);
        } else {
            for(let i=0; i < this.children.length; i++) {
                if (this.children[i] instanceof SplitTree) {
                    this.children[i].split(separator);
                } else {
                    this.children[i] = new SplitTree(this.children[i] as string, separator);
                }
            }
        }
    }

    public join(connector: (separator: string) => string): string {
        const joinedChildren = this.children.map(child => child instanceof SplitTree ? child.join(connector) : child);
        return joinedChildren.join(this.separator !== null ? connector(this.separator) : "");
    }

    protected get childSeparators(): string[] {
        const separators: string[] = [];
        this.children.filter(child => child instanceof SplitTree)
            .forEach((child) => separators.push(...(child as SplitTree).childSeparators));
        return separators;
    }

    private rebuild(separator: string): void {
        const tree = new SplitTree(this.join((separator) => separator), separator);
        this.childSeparators.forEach(sep => tree.split(sep));
        this.separator = separator;
        this.children = tree.children;
    }

}
