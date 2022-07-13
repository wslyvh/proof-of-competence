import { Quest, Task } from "types"

export async function verifyQuestScore(quest: Quest, address: string) {
  let score = 0

  await Promise.all(quest.tasks.map(async (task: Task) => {
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
  if (!address) return false

  if (!Array.isArray(task.verifier)) {
    const module = await import(`verifiers/${task.verifier.id}`)
    const result: boolean | number = await module.verify(task, task.verifier, address)

    return result
  }

  const results = await Promise.all(task.verifier.map(async i => {
    const module = await import(`verifiers/${i.id}`)
    const result: boolean | number = await module.verify(task, i, address)

    return typeof result === 'number' ? result > 0 : result
  }))

  return results.some(i => i)
}

export async function allowMint(quest: Quest, address: string) {
  let minScore = 0
  if (quest.params && quest.params['minScore']) {
    minScore = quest.params['minScore'] as number
  }
  else {
    // max possible score
    minScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
  }

  const score = await verifyQuestScore(quest, address)
  return score >= minScore
}

export function getChainId(task: Task): number {
  if (!Array.isArray(task.verifier)) {
    return task.verifier.chainId ?? 1
  }

  return task.verifier.map(i => i.chainId).find(i => !!i) ?? 1
}
