import Fastify from'fastify'
import { uploadFileController } from '../ioc';
import { readFileSync } from 'node:fs';

// Only for testing purposes
function buildFastify() {
    const app = Fastify()



    app.post('/upload', async (req, reply) => await uploadFileController.handler(req, reply));
    app.inject({
        method: 'POST',
        url: '/upload',
        payload: {
            file: body.get('file')
        }
    })

    return app
}

export { buildFastify }
