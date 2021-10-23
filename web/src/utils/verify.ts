import { Task } from "types"

export async function verifyScore(task: Task, address?: string | null) {
    const module = await import(`verifiers/${task.verifier}`)
    return await module.verify(task, address)
}