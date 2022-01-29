import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { ApiResponse, Quest } from 'types'

type ResponseData = {
  total: number
  quests: Array<Quest>
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<ResponseData>>) {
  const quests = getQuests()

  res.status(200).json({ 
    code: 200,
    message: '',
    data: {
      total: quests.length,
      quests
    }
  })
}
