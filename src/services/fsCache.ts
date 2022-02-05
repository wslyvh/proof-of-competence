import fs from 'fs'
import { join } from 'path'

const configFilePath = join(process.cwd(), 'config-poap.json')

export async function tryGetAccessToken(): Promise<string | undefined> {

    if (fs.existsSync(configFilePath)) {
        const data = fs.readFileSync(configFilePath, 'utf-8')
        const config = JSON.parse(data)

        if (config && new Date(config.expires) > new Date()) {
            return config.accessToken
        }
    }
}

export async function saveAccessToken(token: string, expires: Date) {

    fs.writeFileSync(configFilePath, JSON.stringify({
        accessToken: token,
        expires: expires
    }, null, 4))
}
