// has-nft-ERC721/index.ts
// Reminder:add in `.env.local`: NEXT_PUBLIC_ALCHEMY_API_KEY
//
// Usage: Task example for polygon(chainId 137). 
// {
//     "name": "has NFT on polygon",
//     "description": "Own some ERC721 NFT on polygon.",
//     "points": 100,
//     "verifier": "has-nft-ERC721",
//     "params": {
//          "tokenAddress": "0x7eb476Cd0fE5578106A01DC2f2E392895C6BC0A5",
//     },
//     "chainId":137
//   }  

import { Task } from "types"
import { ethers } from "ethers"
import { AlchemyProvider } from '@ethersproject/providers'

export async function verify(task: Task, address: string): Promise<boolean | number>
{
    if (!address || !task.params) return false

    if(!task.params['tokenAddress']) return false
    const contractAddress =task.params['tokenAddress'].toString()
    if(!ethers.utils.isAddress(contractAddress)) return false

    try { 
        const provider = new AlchemyProvider(task.chainId || 1, process.env.NEXT_PUBLIC_ALCHEMY_API_KEY)
        const contract = await new ethers.Contract( contractAddress, abi, provider)
        const balanceOfNFT= await contract.balanceOf(address)
        if (balanceOfNFT > 0)  
            return true

        return false
    }
    catch(e) {
        return false
    }
}

const abi =
    [{"constant":true,
    "inputs":[{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "payable":false,"stateMutability":"view","type":"function"}]
