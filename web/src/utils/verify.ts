import { Provider } from "@ethersproject/providers"
import { Task } from "types"

export async function verifyScore(task: Task, provider: Provider, address?: string | null) {
    const module = await import(`verifiers/${task.verifier}`)
    const result = await module.verify(provider, address)

    return result
}