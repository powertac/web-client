export enum UserRole {
    Admin = "ADMIN",
    Authenticated = "AUTHENTICATED"
}

export class User {

    constructor(public readonly id: string,
                public readonly username: string,
                public readonly roles: UserRole[],
                public readonly enabled: boolean) {}

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
    roleNames: string[];
    password: string;
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
