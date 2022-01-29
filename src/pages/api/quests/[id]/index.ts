import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { Quest } from 'types'

type ResponseData = {
  quest: Quest
  maxScore: number
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | string>) {
  const id = req.query.id as string
  if (!id) {
    res.status(405).send('quest id not provided.')
    return
  }

  const quest = getQuests().find(i => i.id.toLowerCase() === id.toLowerCase())
  if (!quest) {
    res.status(404).send(`${name} not found.`)
    return
  }

  const maxScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
  if (quest) {
    res.status(200).json({
      quest,
      maxScore
    })
  }
}
