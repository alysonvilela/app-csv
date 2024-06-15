import "dotenv/config"

export const envs = {
    port: Number(process.env.PORT) || 3000,
    dbUrl: String(process.env.DB_URL)
}