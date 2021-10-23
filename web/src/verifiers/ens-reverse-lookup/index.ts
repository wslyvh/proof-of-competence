import { InfuraProvider } from '@ethersproject/providers'
import { Task } from 'types'

export async function verify(task: Task, address: string): Promise<boolean | number>
{
    try { 
        const provider = new InfuraProvider(task.chainId || 1)
        const name = await provider.lookupAddress(address)
        return !!name
    }
    catch(e) {
        return false
    }
}