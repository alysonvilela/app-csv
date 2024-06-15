import { CSVModel } from "../../domain/csv-model";

export abstract class ClientRepository {
    abstract insertMultiple(data: CSVModel[]): Promise<void>
}