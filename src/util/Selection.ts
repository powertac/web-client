import type {Identifiable} from "@/store/Identifiable";

export class Selection<E extends Identifiable> {

    private readonly selected: {[id:string]: E|undefined} = {};

    get entities(): E[] {
        return Object.keys(this.selected)
            .map((id) => this.selected[id])
            .filter((entity) => entity !== undefined)
            .map((entity) => entity as E);
    }

    public includes(entity: E): boolean {
        return this.selected[entity.id] !== undefined;
    }

    public toggle(entity: E): void  {
        this.selected[entity.id] = this.includes(entity) ? undefined : entity;
    }

}
