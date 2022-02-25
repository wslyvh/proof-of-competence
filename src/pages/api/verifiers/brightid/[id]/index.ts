import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseData } from 'types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponseData<any>>) {
    const id = req.query.id as string
    const response = await fetch(`http://node.brightid.org/brightid/v6/verifications/PoC/${id}`)
    const body = await response.json()

    res.status(200).json({
        code: 200,
        message: '',
        data: body.data,
    })
}
