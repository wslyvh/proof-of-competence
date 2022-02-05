import type { NextApiRequest, NextApiResponse } from 'next'
import { mintToken } from 'services/poap'
import { getQuests } from 'services/quests'
import { ApiResponseData } from 'types'
import { verifyQuestScore } from 'utils/verify'
import { tryGetValidAddress } from 'utils/web3'

type RequestBody = {
    account: string
}

type ResponseData = {
    claimed: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponseData<ResponseData>>) {
    if (req.method !== 'POST') {
        res.status(405).json({ code: 405, message: 'only accepts POST requests.' })
        return
    }
    const questId = req.query.id as string
    if (!questId) {
      res.status(405).json({ code: 405, message: 'quest id not provided.' })
      return
    }

    const body = req.body as RequestBody
    if (!body.account) {
        res.status(405).json({ code: 405, message: 'invalid request body.' })
        return
    }

    const address = await tryGetValidAddress(body.account)
    if (!address) {
        res.status(405).json({ code: 405, message: 'invalid account provided.' })
        return
    }

    const quest = getQuests().find(i => i.id.toLowerCase() === questId.toLowerCase())
    if (!quest) {
        res.status(405).json({ code: 405, message: 'invalid quest provided.' })
        return
    }

    const maxScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
    const score = await verifyQuestScore(quest, address)
    if (score < maxScore) {
        res.status(405).json({ code: 405, message: 'not eligible to claim a reward.' })
        return
    }
  
    if (quest.reward === 'poap' && quest.params) {
        // TODO: Check if address is eligble for a reward 
        const mint = await mintToken(quest.params['eventId'] as number, address)
        if (mint.success) {
            res.status(200).json({ code: 200, message: mint.message })
            return
        }
        else {
            res.status(500).json({ code: 500, message: mint.message })
            return
        }
    }

    res.status(500).json({ code: 500, message: 'unable to claim reward.' })
    return
}