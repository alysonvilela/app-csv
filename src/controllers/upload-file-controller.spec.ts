import { FastifyReply, FastifyRequest } from "fastify";
import { clientQueue, logger } from "../ioc";
import { UploadFileUseCase } from "../services/upload-file";
import { UploadFileController } from "./upload-file-controller";
import { readFileSync } from "fs";
import { Readable } from "node:stream";

vi.mock("../services/upload-file");
vi.mock("../lib/queues/client-queue");
vi.mock("../lib/logger");

describe(UploadFileController.name, () => {
  let reply: FastifyReply = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  let uploadFileUseCase: UploadFileUseCase;
  let iot: UploadFileController;

  beforeEach(() => {
    uploadFileUseCase = new UploadFileUseCase(logger, clientQueue);
    iot = new UploadFileController(uploadFileUseCase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should download file and invoke usecase", async () => {
    const rawData = readFileSync(process.cwd() + "/files/minimal.csv");

    const body = new FormData();
    const blob = new Blob([rawData]);

    body.set("file", blob, "example.csv");

    const req = {
      file: async () =>
        await {
          file: new Readable(),
          fieldname: "csv",
        },
    } as unknown as FastifyRequest;

    await iot.handler(req, reply);

    expect(reply.send).toBeCalledWith({
      success: true,
    });
  });

  it("should not permit run service with invalid file", async () => {
    const rawData = readFileSync(process.cwd() + "/files/minimal.csv");

    const body = new FormData();
    const blob = new Blob([rawData]);

    body.set("file", blob, "example.jpg");

    const req = {
      file: async () =>
        await {
          file: new Readable(),
          fieldname: "jpg",
        },
    } as unknown as FastifyRequest;

    await iot.handler(req, reply);

    expect(reply.send).toBeCalledWith({
      message: "Invalid file format",
    });
  });
});
