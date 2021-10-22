import { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'

export async function verify(provider: Provider, address: string): Promise<boolean | number>
{
    try { 
        const name = await provider.lookupAddress(address)
        return !!name
    }
    catch(e) {
        return false
    }
}