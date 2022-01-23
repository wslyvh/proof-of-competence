import { Task } from 'types'
import { APP_CONFIG } from 'utils/config'
import { getEtherscanBaseApiUri } from 'utils/web3'

export async function verify(task: Task, address: string): Promise<boolean | number>
{
    try { 
        const etherscanBaseUri = getEtherscanBaseApiUri(task.chainId)
        const history = await fetch(`${etherscanBaseUri}?module=account&action=txlist&address=${address}&apiKey=${APP_CONFIG.ETHERSCAN_API_KEY}`)
        const data = await history.json()
        if (data.message !== 'OK') return false

        return data.result.some((tx: any) => !tx.to && tx.contractAddress)
    }
    catch(e) {
        return false
    }
}