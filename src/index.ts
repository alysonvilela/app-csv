import { envs } from './envs'
import { listClientsHistoryController, uploadFileController } from './ioc'
import fastify from 'fastify'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import "./ioc"

const app = fastify()

app.register(cors,
    {
      origin: "*",
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true
    }
)

app.register(multipart, {
  // attachFieldsToBody: true,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  }
});

app.post('/upload', async (req, reply) => await uploadFileController.handler(req, reply));
app.get('/history', async (req, reply) => await listClientsHistoryController.handler(req, reply));

app.listen({ host: "0.0.0.0", port: envs.port }, function (err) {
  if (err) {
    throw err
  }
})