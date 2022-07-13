// has-token-ERC20/index.ts
// Reminder:add in `.env.local`: NEXT_PUBLIC_ALCHEMY_API_KEY
//
/*
Usage: Task example for polygon(chainId 137). You can omit amount if you just want to check > 0. 
{
    "name": "has WETH on polygon",
    "description": "Own some WETH (Wrapped ETH, ERC20) on polygon.",
    "points": 100,
    "verifier": "has-token-ERC20",
    "params": {
         "tokenAddress": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
         "amount":0.1
    },
    "chainId":137
  }  
*/
import { Task, Verifier } from "types"
import { ethers } from "ethers"
import { AlchemyProvider } from '@ethersproject/providers'
import { APP_CONFIG } from 'utils/config'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number> {
    if (!address || !verifier.params) return false

    if (!verifier.params['tokenAddress']) return false
    const contractAddress = verifier.params['tokenAddress'].toString()
    if (!ethers.utils.isAddress(contractAddress)) return false

    let amount: number = 0
    if ('amount' in verifier.params)
        amount = Number(verifier.params['amount'])

    try {
        const provider = new AlchemyProvider(verifier.chainId || 1, APP_CONFIG.ALCHEMY_API_KEY)
        const contract = await new ethers.Contract(contractAddress, abi, provider)
        const balanceOf = await contract.balanceOf(address)
        if (balanceOf / 1e18 > amount)
            return true

        return false
    }
    catch (e) {
        return false
    }
}

const abi =["function balanceOf(address owner) view returns (uint balance)"]

// const abi =
//     [{
//         "constant": true,
//         "inputs": [{ "name": "who", "type": "address" }],
//         "name": "balanceOf",
//         "outputs": [{ "name": "", "type": "uint256" }],
//         "payable": false, "stateMutability": "view", "type": "function"
//     }]
