import type { NextApiRequest, NextApiResponse } from 'next'
import { getRewardStats } from 'services/poap'
import { getQuests } from 'services/quests'
import { ApiResponseData } from 'types'

type ResponseData = {
    total: number,
    claimed: number,
    available: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponseData<ResponseData>>) {
    const questId = req.query.id as string
    if (!questId) {
        res.status(405).json({ code: 405, message: 'quest id not provided.' })
        return
    }

    const quest = getQuests().find(i => i.id.toLowerCase() === questId.toLowerCase())
    if (!quest) {
        res.status(405).json({ code: 405, message: 'invalid quest provided.' })
        return
    }

    if (quest.reward === 'poap' && quest.params) {
        const stats = await getRewardStats(quest.params['eventId'] as number)
        res.status(200).json({ code: 200, message: '', data: stats })
        return
    }

    res.status(500).json({ code: 500, message: 'unable to get reward stats.' })
    return
}