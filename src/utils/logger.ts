export class LoggerSingleton {
    private static instance: LoggerSingleton | null = null;

    private constructor() { }
    public static getInstance(): LoggerSingleton {
        if (!this.instance) {
            this.instance = new LoggerSingleton();
        }
        return this.instance;
    }
    public log(where: string, message?: string) {
        console.log(`[${where.toUpperCase()}]: `, message);
    }
}
