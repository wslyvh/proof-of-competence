import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { Quest } from 'types'

type ResponseData = {
  total: number
  quests: Array<Quest>
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const quests = getQuests()

  res.status(200).json({ total: quests.length, quests })
}
