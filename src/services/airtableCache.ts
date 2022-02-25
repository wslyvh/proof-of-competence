import Airtable from 'airtable'

const client = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_API_BASE ?? '')

export async function tryGetAccessToken(): Promise<string | undefined> {
    try {
        const records = await client('Tokens').select({
            filterByFormula: `({expires} > TODAY())`,
            maxRecords: 1
        }).all()

        return records.map((i) => i.fields['access_token'] as string).find(i => !!i)
    }
    catch (e) {
        // ignore
    }
}

export async function saveAccessToken(token: string, expires: Date) {
    try {
        const response = await client('Tokens').create({
            "access_token": token,
            "expires": expires.toString()
        })

        if (!response.id) {
            console.log('Unable to save access token')
        }
    }
    catch (e) {
        console.log('Unable to save access token')
        console.error(e)
    }
}

export async function getEventSecret(eventId: number): Promise<string | undefined> { 
    try {
        const records = await client('Events').select({
            filterByFormula: `({event_id} = ${eventId})`,
            maxRecords: 1
        }).all()

        return records.map(i => i.fields['event_secret'] as string).shift()
    }
    catch (e) {
        console.log('Unable to get event secrets')
        console.error(e)
    }

    return
}