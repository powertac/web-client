export const config = {
    orchestrator: {
        url: import.meta.env.VITE_ORCHESTRATOR_URL
    },
    auth: {
        secret: import.meta.env.VITE_TOKEN_SECRET // FIXME : this is not safe!
    }
}
