import {unique} from "@/util/String";
import {SplitTree} from "@/util/SplitTree";

const termMinLength = 2;
const defaultMarkClasses = ['font-semibold', 'text-blue-600'];

export function parseTerms(search: string): string[] {
    return unique(search.split(' ')
        .map((term) => term.toLowerCase())
        .filter((term) => /\S/.test(term))
        .filter((term) => term.length >= termMinLength));
}

export function matchTerms(str: string, terms: string[]): string[] {
    const allMatches: string[] = [];
    terms.map((term) => str.match(new RegExp(term, "gi")))
        .filter((matches) => matches !== null)
        .forEach((matches) => allMatches.push(...(matches as string[])));
    return unique(allMatches);
}

export function includesAll(str: string, terms: string[]): boolean {
    return unique(matchTerms(str, terms).map(match => match.toLowerCase())).length === terms.length;
}

export function matchAll(terms: string[], items: string[]): string[] {
    return items.filter(item => includesAll(item, terms));
}

export function markTerms(str: string, terms: string[], classes?: string[]): string {
    classes = classes !== undefined ? classes : defaultMarkClasses;
    const tree = SplitTree.create(str);
    matchTerms(str, terms).forEach((match) => tree.split(match));
    return tree.join(match => '<span class="' + classes?.join(" ") + '">' + match + '</span>');
}
