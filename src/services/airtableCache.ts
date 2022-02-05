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
