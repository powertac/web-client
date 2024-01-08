export enum UserRole {
    Admin = "ADMIN",
    Base = "BASE",
    Authenticated = "AUTHENTICATED"
}

export class User {

    constructor(public readonly id: string,
                public readonly username: string,
                public readonly roles: UserRole[],
                public readonly enabled: boolean) {}

    static compare(a: User|undefined, b: User|undefined): number {
        if (a == undefined && b === undefined) return 0;
        if (a === undefined) return 1;
        if (b === undefined) return -1;
        return a.username.localeCompare(b.username);
    }

    get isAdmin(): boolean {
        return this.hasRole(UserRole.Admin);
    }

    public hasRole(role: UserRole): boolean {
        return this.roles.filter(r => r === role).length === 1;
    }

}

export interface UserData {
    id: string;
    username: string;
    roles: string[];
    enabled: boolean;
}

export interface CreateUserData {
    username: string;
    password: string;
    roles: string[];
    token: string;
}

export interface UpdateUserData {
    userId: string;
    password: string|null;
    roleNames: string[];
    enabled: boolean;
}

export function buildUser(data: UserData): User {
    return new User(
        data.id,
        data.username,
        data.roles.map(role => role as UserRole),
        data.enabled
    );
}
