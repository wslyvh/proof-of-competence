import type { NextApiRequest, NextApiResponse } from 'next'
import { getAccessToken } from 'services/poap'

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    const accessToken = await getAccessToken()
    console.log('POAP Access token', !!accessToken)

    res.status(200).json('Ok')
}
