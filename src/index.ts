import { Hono } from 'hono'
import { envs } from './envs'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  port: envs.port,
  app
}
