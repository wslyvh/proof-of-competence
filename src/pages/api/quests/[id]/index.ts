import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { ApiResponse, Quest } from 'types'

type ResponseData = {
  quest: Quest
  maxScore: number
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<ResponseData>>) {
  const id = req.query.id as string
  if (!id) {
    res.status(405).json({
      code: 405,
      message: 'quest id not provided.',
    })
    return
  }

  const quest = getQuests().find(i => i.id.toLowerCase() === id.toLowerCase())
  if (!quest) {
    res.status(404).json({
      code: 404,
      message: `quest ${name} not found.`,
    })
    return
  }

  const maxScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
  if (quest) {
    res.status(200).json({
      code: 200,
      message: '',
      data: {
        quest,
        maxScore
      }
    })
  }
}
