import fs from 'fs'
import os from 'os'
import { join } from 'path'
import { APP_CONFIG } from 'utils/config'

interface POAPAuthConfig {
    accessToken: string
    expires: Date
}

export async function getAccessToken(): Promise<string | undefined> {
    let config: POAPAuthConfig | undefined

    // Check if config is cached already. POAP Auth endpoint is heavily rate-limited.
    const configFilePath = join(os.tmpdir(), 'config-poap.json')
    if (fs.existsSync(configFilePath)) {
        console.log('Config file exists..')
        const data = fs.readFileSync(configFilePath, 'utf-8')
        config = JSON.parse(data)
    }

    // If config is still valid
    if (config && new Date(config.expires) > new Date()) {
        console.log('Access token is still valid. Return from config..')
        return config.accessToken
    }

    // If not, get new POAP access token
    console.log('Get new access token from POAP OAuth')
    const authResponse = await fetch('https://poapauth.auth0.com/oauth/token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            audience: 'proof-of-competence',
            grant_type: 'client_credentials',
            client_id: APP_CONFIG.POAP_CLIENT_ID,
            client_secret: APP_CONFIG.POAP_CLIENT_SECRET
        })
    })

    const auth = await authResponse.json()
    if (authResponse.status === 200 && auth.access_token) {
        // Write config to disk
        config = {
            accessToken: auth.access_token,
            expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
        }
        console.log('Write new config to disk..', configFilePath)
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 4))

        return config.accessToken
    }

    console.error('Unable to get valid access token..')
}
