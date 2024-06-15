import { envs } from './envs'
import { uploadFileController } from './ioc'
import fastify from 'fastify'
import multipart from '@fastify/multipart'
import "./lib/queues/producers"
import "./ioc"

const app = fastify()

app.register(multipart, {
  // attachFieldsToBody: true,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  }
});

app.post('/upload', async (req, reply) => await uploadFileController.handler(req, reply));

app.listen({ host: "0.0.0.0", port: envs.port }, function (err) {
  if (err) {
    throw err
  }
})