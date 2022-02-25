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
  const module = await import(`verifiers/${task.verifier}`)
  const result: boolean | number = await module.verify(task, address)

  return result
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