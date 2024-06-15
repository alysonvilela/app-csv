import * as PubSub from 'pubsub-js'
import { EmailQueueSingleton } from './email-queue';

let publish = vi.fn()
let subscribe = vi.fn()

vi.mock("pubsub-js")
vi.mock("pubsub-js", async (importOriginal) => {
    const old = await importOriginal<typeof import("pubsub-js")>()
    return {
        ...old,
        clearAllSubscriptions: old.clearAllSubscriptions,
        publish: (...args: any[]) => publish(...args),
        subscribe: (...args: any[]) => subscribe(...args),
    }
})


describe(EmailQueueSingleton.name, () => {

    let subscribeResolver = vi.fn().mockResolvedValue({})
    let iot: EmailQueueSingleton

    beforeEach(() => {
        iot = new EmailQueueSingleton(subscribeResolver)
    })

    afterEach(() => {
        vi.clearAllMocks()
        PubSub.clearAllSubscriptions()
    })

    it('should call resolver when a publish happen', async () => {
        const data = {
            debtAmount: 1,
            debtDueDate: new Date(),
            debtId: "1",
            email: "1",
            governmentId: 1,
            name: "1"
        }

        iot.pub(data)

        expect(publish).toBeCalledWith(iot.topic, data)
        expect(subscribe).toBeCalledWith(iot.topic, expect.any(Function))
    })

})