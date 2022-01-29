import { join, resolve } from 'path'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log('Files handler..')

  try {
    const dir = resolve(process.cwd(), "quests");
    const files = fs.readdirSync(dir, { withFileTypes: true }).map((i: any) => i.name)
    fs.readdirSync(dir, { withFileTypes: true }).forEach((i: any) => {
      console.log('  -', i.name)
    })

    res.status(200).json({ data: files })
  }
  catch (e) {
    console.log('Unable to read files..')
    console.error(e)
    res.status(500).json({ data: undefined })
  }
}
