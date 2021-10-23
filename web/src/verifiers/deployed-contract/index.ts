import { Task } from 'types'
import { getEtherscanBaseApiUri } from 'utils/web3'

export async function verify(task: Task, address: string): Promise<boolean | number>
{
    try { 
        const etherscanBaseUri = getEtherscanBaseApiUri(task.chainId)
        const history = await fetch(`${etherscanBaseUri}?module=account&action=txlist&address=${address}&apiKey=RQW7FJGXRBIHPM5EYQSVPY96Q2EV2Q9RR2`)
        const data = await history.json()
        if (data.message !== 'OK') return false

        return data.result.some(tx => !tx.to && tx.contractAddress)
    }
    catch(e) {
        return false
    }
}