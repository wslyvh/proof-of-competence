import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number>
{
    if (!address) return false
    if (!Array.isArray(verifier.params['ids'])) return false

    try { 
        const eventIds = verifier.params['ids']
        const poaps = await fetch(`https://api.poap.xyz/actions/scan/${address}`)
        const data = await poaps.json()

        if (!Array.isArray(data) || data.length === 0) return false
        if (!Array.isArray(eventIds) || eventIds.length === 0) return false

        return data.map(i => i.event.id).some(i => eventIds.includes(i))
    }
    catch(e) {
        return false
    }
}
