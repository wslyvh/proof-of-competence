import type { NextApiRequest, NextApiResponse } from 'next'
import { getJourneys } from 'services/journey'
import { Journey } from 'types'
import { verifyJourneyScore } from 'utils/verify'

type ResponseData = {
  journey: Journey
  address: string
  score: number
  maxScore: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | string>) {
  const name = req.query.journey as string
  if (!name) {
    res.status(405).send("name not provided.")
    return
  }
  const address = req.query.address as string
  if (!address) {
    res.status(405).send("address not provided.")
    return
  }

  const journey = getJourneys().find(i => i.id.toLowerCase() === name.toLowerCase())
  if (!journey) {
    res.status(404).send(`${name} not found.`)
    return
  }

  const maxScore = journey.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
  const score = await verifyJourneyScore(journey, address)

  if (journey) {
    res.status(200).json({ 
      journey,
      address,
      score,
      maxScore
     })
  }
}
