import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { ApiResponse, Quest } from 'types'
import { verifyQuestScore } from 'utils/verify'
import { tryResolveName } from 'utils/web3'

type ResponseData = {
  address: string
  score: number
  maxScore: number
  quest: Quest
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<ResponseData>>) {
  const id = req.query.id as string
  if (!id) {
    res.status(405).json({
      code: 405,
      message: 'quest id not provided.',
    })
    return
  }
  const account = req.query.account as string
  if (!account) {
    res.status(405).json({
      code: 405,
      message: 'account not provided.',
    })
    return
  }

  let address: string | undefined;
  const validAddress = ethers.utils.isAddress(account)
  if (validAddress) {
    address = account
  }
  if (!validAddress) {
    address = await tryResolveName(account)
  }
  if (!address) {
    res.status(400).json({
      code: 400,
      message: 'account not valid.',
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
  const score = await verifyQuestScore(quest, address)

  if (quest) {
    res.status(200).json({
      code: 200,
      message: '',
      data: {
        address,
        score,
        maxScore,
        quest
      }
    })
  }
}
