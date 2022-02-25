// has-ETH/index.ts
// Reminder:add in `.env.local`: NEXT_PUBLIC_ALCHEMY_API_KEY
//
// Usage: Task example for polygon(chainId 137). You can omit amount if you just want to check > 0. 
//     {
//     "name": "has MATIC on polygon",
//     "description": "Own some MATIC on polygon.",
//     "points": 100,
//     "verifier": "has-ETH",
//     "params": {
//          "amount":0.1
//     }
//     "chainId":137
//   }  

import { Task, Verifier } from "types"
import { ethers } from "ethers"
import { AlchemyProvider } from '@ethersproject/providers'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number>
{
    if (!address) return false
    let amount:number = 0
    if (verifier.params){
        if('amount' in verifier.params) amount = Number(verifier.params['amount'])
    }
    
    try { 
        const provider = new AlchemyProvider(verifier.chainId || 1, process.env.NEXT_PUBLIC_ALCHEMY_API_KEY)
        const balance= await provider.getBalance(address)
        if (Number(ethers.utils.formatEther(balance)) > amount)  
            return true
        
        return false
    }
    catch(e) {
        return false
    }
}
