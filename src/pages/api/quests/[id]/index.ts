import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { ApiResponseData, Quest } from 'types'

type ResponseData = {
  quest: Quest
  maxScore: number
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponseData<ResponseData>>) {
  const id = req.query.id as string
  if (!id) {
    res.status(405).json({ code: 405, message: 'quest id not provided.' })
    return
  }

  const quest = getQuests().find(i => i.id.toLowerCase() === id.toLowerCase())
  if (!quest) {
    res.status(405).json({ code: 405, message: 'invalid quest provided.' })
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
