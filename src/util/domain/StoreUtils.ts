import {EntityNotFoundError} from "@/util/domain/EntityNotFoundError";
import type {Store, StoreDefinition} from "pinia";

export function createFindByIdGetter<E>(type: string, entities: {[id: string]: E|undefined}): (id: string) => E {
    return (id: string): E => {
        const entity = entities[id];
        if (entity === undefined) {
            throw new EntityNotFoundError("could not find " + type + "(id=" + id + ")");
        }
        return entity;
    }
}

export function createFindAllGetter<E>(entities: {[id: string]: E|undefined}): () => E[] {
    return () => Object.keys(entities)
        .map((key) => entities[key])
        .filter((obj: E|undefined) => obj !== undefined)
        .map((entity) => entity as E);
}



