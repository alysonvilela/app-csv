import { CSVModel } from "../domain/csv-model";

let counter = 0
export class SendEmailCommand {
    constructor() { }

    async execute(data: CSVModel) {
        await new Promise((res) => setTimeout(res, 5000))
        console.log(new Date(), counter++)
    }
}