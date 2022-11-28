import {defineStore} from "pinia";

export const useApplicationStore = defineStore("application", {
    state: () => {
        return {
            authenticated: false
        }
    },
    getters: {
        authenticated: state => state.authenticated
    },
    actions: {
        setAuthenticated(isAuthenticated: boolean) {
            this.authenticated = isAuthenticated
        }
    }
})
