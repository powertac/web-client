import type {User} from "@/user/domain/User";
import {useUserStore} from "@/user/domain/UserStore";
import {DateTime} from "luxon";

export class RegistrationToken {

    constructor(public readonly id: number,
                public readonly token: string,
                public readonly issuedById: string,
                public readonly issuedAt: DateTime,
                public readonly claimedById: string|null,
                public readonly claimedAt: DateTime|null,
                public readonly expiresAt: DateTime) {}

    get issuedBy() : User {
        return useUserStore().findById(this.issuedById);
    }

    get claimedBy() : User|null {
        return this.claimedById !== null
            ? useUserStore().findById(this.claimedById)
            : null;
    }

    get status(): string {
        if (this.claimedAt !== null && this.claimedBy !== null) {
            return "CLAIMED";
        } else if (DateTime.now() > this.expiresAt) {
            return "EXPIRED";
        } else {
            return "OPEN";
        }
    }

}

export interface RegistrationTokenData {
    id: number;
    token: string;
    issuedBy: string;
    issuedAt: number;
    claimedBy: string|null;
    claimedAt: number|null;
    expiresAt: number;
}

export function buildRegistrationToken(data: RegistrationTokenData): RegistrationToken {
    return new RegistrationToken(
        data.id,
        data.token,
        data.issuedBy,
        DateTime.fromMillis(data.issuedAt),
        data.claimedBy,
        data.claimedAt !== null ? DateTime.fromMillis(data.claimedAt) : null,
        DateTime.fromMillis(data.expiresAt));
}
