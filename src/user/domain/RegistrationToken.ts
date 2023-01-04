import type {User} from "@/user/domain/User";
import {useUserStore} from "@/user/domain/UserStore";
import {DateTime} from "luxon";

export class RegistrationToken {

    constructor(public readonly id: number,
                public readonly token: string,
                public readonly issuedBy: User,
                public readonly issuedAt: DateTime,
                public readonly claimedBy: User|null,
                public readonly claimedAt: DateTime|null,
                public readonly expiresAt: DateTime) {}

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

const userStore = useUserStore();

export function buildRegistrationToken(data: RegistrationTokenData): RegistrationToken {
    return new RegistrationToken(
        data.id,
        data.token,
        userStore.findById(data.issuedBy),
        DateTime.fromMillis(data.issuedAt),
        data.claimedBy !== null ? userStore.findById(data.claimedBy) : null,
        data.claimedAt !== null ? DateTime.fromMillis(data.claimedAt) : null,
        DateTime.fromMillis(data.expiresAt));
}
