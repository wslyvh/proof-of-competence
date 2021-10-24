import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { constants, utils } from 'ethers'
import { Journey } from 'types'

const easAbi = require("./abis/EAS.json")
const easAddress = '0xBf49E19254DF70328C6696135958C94CD6cd0430'

 // bytes32 journey, uint8 version, uint256 score, bool completed
const journeyUuid = '0x13db044bc5e4c02836b7c6796c90e79d5fb719d9e9bca649e0cb589985b27012'

export async function attestScore(journey: Journey, score: number, address: string, provider: Web3Provider): Promise<string> {
    const signer = provider.getSigner()
    const eas = new Contract(easAddress, easAbi, signer)
    
    const maxScore = journey.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)
    const completed = score >= maxScore

    // bytes32 journey, uint8 version, uint256 score, bool completed
    const encoded = utils.defaultAbiCoder.encode(
        ['bytes32', 'uint8', 'uint256', 'bool'],
        [utils.formatBytes32String(journey.id), 1, score, completed])

    // attest(recipient, schema, expirationTime, refUUID, data, msg.sender)
    const params = [
        address,
        journeyUuid,
        constants.MaxUint256,
        constants.HashZero,
        encoded
    ]

    const tx = await eas.attest.apply(null, params)
    return tx.hash
}