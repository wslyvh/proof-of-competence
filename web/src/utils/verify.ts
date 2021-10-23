import { Task } from "types"

export async function verifyScore(task: Task, address?: string | null) {
    const module = await import(`verifiers/${task.verifier}`)
    const result: boolean | number = await module.verify(task, address)

    return result
}