import { Hono } from 'hono'
import { envs } from './envs'
import { uploadFileController } from './ioc'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/upload', uploadFileController.handler)

export default {
  port: envs.port,
  fetch: app.fetch, 
}
