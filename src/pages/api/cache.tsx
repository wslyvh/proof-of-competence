import fs from 'fs'
import os from 'os'
import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    let content: Date | undefined
    const configFilePath = join(os.tmpdir(), 'temp-config.json')
    if (fs.existsSync(configFilePath)) {
        console.log('Config file exists..')
        const data = fs.readFileSync(configFilePath, 'utf-8')
        content = new Date(data)
    }

    // If config is still valid
    if (content && content > new Date()) {
        console.log('Content already exists. Return from config..')
        return res.status(200).json('FROM CONFIG: ' + content.toString())
    }

    content = new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
    console.log('Write new config to disk..', configFilePath)
    fs.writeFileSync(configFilePath, content.toString())

    return res.status(200).json('NEW: ' + content.toString())
}
