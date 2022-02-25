import { Task, Verifier } from "types"
import { APP_CONFIG } from "utils/config"

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number>
{
    if (!address) return false
    if (!Array.isArray(verifier.params['addresses'])) return false

    try { 
        const nftContractAddresses = verifier.params['addresses']
        const response = await fetch(`https://eth-mainnet.g.alchemy.com/${APP_CONFIG.ALCHEMY_API_KEY}/v1/getNFTs/?owner=${address}&contractAddresses=${nftContractAddresses.join(',')}`)
        const data = await response.json()

        if (!data.ownedNfts || !Array.isArray(data.ownedNfts) || data.length === 0) return false
        if (!Array.isArray(nftContractAddresses) || nftContractAddresses.length === 0) return false

        return data.ownedNfts.map((i: any) => i.contract.address).some((i: string) => nftContractAddresses.includes(i))
    }
    catch(e) {
        return false
    }
}

