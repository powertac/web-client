import type {User} from "@/user/domain/User";
import type {Moment} from "moment";
import moment from "moment";
import {useUserStore} from "@/user/domain/UserStore";

export class RegistrationToken {

    constructor(public readonly id: number,
                public readonly token: string,
                public readonly issuedBy: User,
                public readonly issuedAt: Moment,
                public readonly claimedBy: User|null,
                public readonly claimedAt: Moment|null,
                public readonly expiresAt: Moment) {}

    get status(): string {
        if (this.claimedAt !== null && this.claimedBy !== null) {
            return "CLAIMED";
        } else if (this.expiresAt.isBefore(moment())) {
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
        moment(data.issuedAt),
        data.claimedBy !== null ? userStore.findById(data.claimedBy) : null,
        data.claimedAt !== null ? moment(data.claimedAt) : null,
        moment(data.expiresAt));
}
