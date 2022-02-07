import { ApiResponse } from 'types'
import { APP_CONFIG } from 'utils/config'
import { saveAccessToken as saveAccessTokenToAirtable, tryGetAccessToken as tryGetAccessTokenFromAirtable } from './airtableCache'
import { saveAccessToken as saveAccessTokenToFs, tryGetAccessToken as tryGetAccessTokenFromFs } from './fsCache'

const cache = new Map()

export async function getAccessToken(): Promise<string | undefined> {
    const production = APP_CONFIG.NODE_ENV === 'production'

    // POAP Auth endpoint is heavily rate-limited. Need to request only once per 24h.
    // Production => Airtable DB (Nextjs cache isn't persistant)
    // Local development => Filesystem (no need for API keys)

    if (production) {
        console.log('Try to get a valid access token from Airtable..')
        const accessToken = await tryGetAccessTokenFromAirtable()
        if (accessToken) {
            console.log('Return token found from Airtable..')
            return accessToken
        }
    }

    if (!production) {
        console.log('Try to get a valid access token from Filesystem..')
        const accessToken = await tryGetAccessTokenFromFs()
        if (accessToken) {
            console.log('Return token found from Filesystem..')
            return accessToken
        }
    }

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
        if (production) {
            console.log('Save token to Airtable..')
            saveAccessTokenToAirtable(auth.access_token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000))
        }

        if (!production) {
            console.log('Save token to Filesystem..')
            saveAccessTokenToFs(auth.access_token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000))
        }

        return auth.access_token
    }
}

export async function mintToken(eventId: number, address: string): Promise<ApiResponse> {
    console.log('Minting POAP for', eventId, address)

    // 1. Get an available QR codes. POAP API is rate-limited, so saving available codes in (short-term) API cache
    const availableCodesCacheKey = `poap.service:mintToken.availableCodes-${eventId}`
    if (!cache.has(availableCodesCacheKey)) {
        const qrCodes = await getQrCodes(eventId)
        const availableCodes = qrCodes.filter((i: any) => !i.claimed).map((i: any) => i.qr_hash)
        cache.set(availableCodesCacheKey, availableCodes)
    }
    const qrCode = cache.get(availableCodesCacheKey).find((i: any) => !!i)
    cache.set(availableCodesCacheKey, cache.get(availableCodesCacheKey).filter((i: any) => i !== qrCode))

    const accessToken = await getAccessToken()
    // 1. Request claim secret for a QR, that is required to mint the POAP
    const claimResponse = await fetch('https://api.poap.tech/actions/claim-qr?qr_hash=' + qrCode, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })
    const claim = await claimResponse.json()
    const claimSecret = claim.secret

    // 3. Claim POAP
    const mintResponse = await fetch('https://api.poap.tech/actions/claim-qr?qr_hash=' + qrCode, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            address: address,
            qr_hash: qrCode,
            secret: claimSecret,
        })
    })

    const mint = await mintResponse.json()
    return {
        success: mint.claimed,
        message: mint.message
    }
}

export async function getRewardStats(eventId: number) {
    console.log('Get rewards stats', eventId)

    const qrCodes = await getQrCodes(eventId)
    const claimed = qrCodes.filter((i: any) => i.claimed).length
    const available = qrCodes.filter((i: any) => !i.claimed).length

    return {
        total: qrCodes.length,
        claimed: claimed,
        available: available
    }
}

export async function getQrCodes(eventId: number) {
    const cacheKey = `poap.service:getQrCodes-${eventId}`
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
    }

    try {
        const accessToken = await getAccessToken()
        const qrResponse = await fetch(`https://api.poap.tech/event/${eventId}/qr-codes`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                secret_code: APP_CONFIG.POAP_TEST_EVENT_SECRET, // TODO: Need to find a better way to handle event secrets
            })
        })

        const qrCodes = await qrResponse.json() as any[]
        cache.set(cacheKey, qrCodes)

        const available = qrCodes.filter((i: any) => !i.claimed).length
        const claimed = qrCodes.filter((i: any) => i.claimed).length
        if (available - claimed < 10) {
            console.log('Running out of codes.. Requesting more.')
            requestMoreCodes(eventId)
        }

        return cache.get(cacheKey)
    }
    catch (e) {
        console.log('Unable to get Qr codes', e)
        return []
    }
}

export async function requestMoreCodes(eventId: number) {
    const accessToken = getAccessToken()

    const redeemResponse = await fetch('https://api.poap.tech/redeem-requests', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            event_id: eventId,
            requested_codes: 100,
            secret_code: APP_CONFIG.POAP_TEST_EVENT_SECRET, // TODO: Need to find a better way to handle event secrets
            redeem_type: "qr_code"
        })
    })

    const response = await redeemResponse.json()
    console.log('Redeem requests', response)
}