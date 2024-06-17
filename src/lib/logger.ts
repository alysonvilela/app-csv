export class LoggerSingleton {
  private static instance: LoggerSingleton | null = null;

  constructor() {}
  public static getInstance(): LoggerSingleton {
    if (!this.instance) {
      this.instance = new LoggerSingleton();
    }
    return this.instance;
  }
  public log(where: string, message?: unknown) {
    console.log(`[${where.toUpperCase()}]: `, message);
  }
}
