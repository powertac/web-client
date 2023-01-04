const wordSeparator = " ";

export function capitalize(string: string): string {
    return string.split(wordSeparator)
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(wordSeparator);
}

export function unique(strings: string[]): string[] {
    const uniqueMatches: {[match: string]: boolean} = {};
    strings.forEach((str) => uniqueMatches[str] = true);
    return Object.keys(uniqueMatches);
}



