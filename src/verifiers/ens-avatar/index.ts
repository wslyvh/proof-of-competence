import { InfuraProvider } from '@ethersproject/providers'
import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number>
{
    try { 
        const provider = new InfuraProvider(verifier.chainId || 1)
        const name = await provider.lookupAddress(address)
        if (!name) return false

        const resolver = await provider.getResolver(name)
        if (!resolver) return false

        const avatar = await resolver.getAvatar()
        return !!avatar
    }
    catch(e) {
        return false
    }
}