import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'
import fs from 'fs'

export default function handler(req: NextApiRequest, res: NextApiResponse<Array<string>>) {
  console.log('Files handler..')

  const current = join(__dirname)
  console.log('Current dir', current)

  const files = fs.readdirSync(current, { withFileTypes: true }).map(i => i.name)
  fs.readdirSync(current, { withFileTypes: true }).forEach(i => {
    console.log('  -', i.name)
  })


  try { 
    const questsDir = join(__dirname, 'quests')
    console.log('Quests dir', questsDir)
    const quests = fs.readdirSync(current, { withFileTypes: true }).map(i => i.name)
    fs.readdirSync(current, { withFileTypes: true }).forEach(i => {
      console.log('  -', i.name)
    })
  }
  catch (e) { 
    console.log('Unable to fetch quests')
    console.error(e)
  }

  res.status(200).json(files)
}
