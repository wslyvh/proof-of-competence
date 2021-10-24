import type { NextApiRequest, NextApiResponse } from 'next'
import { getJourneys } from 'services/journey'
import { Journey } from 'types'

type ResponseData = {
  journey: Journey
  maxScore: number
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | string>) {
  const name = req.query.name as string
  if (!name) {
    res.status(405).send("address not provided.")
    return
  }

  const journey = getJourneys().find(i => i.id.toLowerCase() === name.toLowerCase())
  if (!journey) {
    res.status(404).send(`${name} not found.`)
    return
  }

  const maxScore = journey.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
  if (journey) {
    res.status(200).json({ 
      journey,
      maxScore
     })
  }
}
