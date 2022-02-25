import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number>
{
    if (!address) return false

    try { 
        const poaps = await fetch(`https://api.poap.xyz/actions/scan/${address}`)
        const data = await poaps.json()

        if (Array.isArray(data) && data.length > 0) {
            return true
        }

        return false
    }
    catch(e) {
        return false
    }
}