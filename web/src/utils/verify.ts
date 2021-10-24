import { Journey, Task } from "types"

export async function verifyJourneyScore(journey: Journey, address: string) {
    let score = 0

    await Promise.all(journey.tasks.map(async (task: Task) => {
        const result = await verifyScore(task, address)
        if (result && typeof result === 'boolean') {
          score += task.points
        }
        if (result && typeof result === 'number') {
          score += result
        }
    }))

    return score
}

export async function verifyScore(task: Task, address?: string | null) {
    const module = await import(`verifiers/${task.verifier}`)
    const result: boolean | number = await module.verify(task, address)

    return result
}