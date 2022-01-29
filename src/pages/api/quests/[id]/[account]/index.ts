import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuests } from 'services/quests'
import { Quest } from 'types'
import { APP_CONFIG } from 'utils/config'
import { verifyQuestScore } from 'utils/verify'
import { tryResolveName } from 'utils/web3'

type ResponseData = {
  address: string
  score: number
  maxScore: number
  quest: Quest
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | string>) {
  const id = req.query.id as string
  if (!id) {
    res.status(405).send('quest id not provided.')
    return
  }
  const account = req.query.account as string
  if (!account) {
    res.status(405).send('account not provided.')
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
    res.status(400).send('account not valid.')
    return
  }

  const quest = getQuests().find(i => i.id.toLowerCase() === id.toLowerCase())
  if (!quest) {
    res.status(404).send(`Quest '${id}' not found.`)
    return
  }

  const maxScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
  const score = await verifyQuestScore(quest, address)

  if (quest) {
    res.status(200).json({
      address,
      score,
      maxScore,
      quest
    })
  }
}
