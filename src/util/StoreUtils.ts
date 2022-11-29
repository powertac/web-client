import {EntityNotFoundError} from "@/util/EntityNotFoundError";

export function createGetter<E>(type: string, entities: {[id: string]: E}, identifier?: string) {
    return (id: string): E => {
        const entity = entities[id];
        if (entity === undefined) {
            throw new EntityNotFoundError("could not find " + type + "(id=" + id + ")");
        }
        return entity;
    }
}


