import { InjectedConnector } from "@web3-react/injected-connector";
import { ExternalProvider, getNetwork, JsonRpcFetchFunc } from "@ethersproject/providers"
import { Web3Provider } from "@ethersproject/providers"
import { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { APP_CONFIG } from "./config";
import { ethers } from "ethers";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 10, 42, 42161]
})

export const walletConnectConnector = new WalletConnectConnector({
    rpc: {
        1: `https://mainnet.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
        3: `https://ropsten.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
        4: `https://rinkeby.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
        5: `https://goerli.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
        10: `https://optimism-mainnet.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
        42: `https://kovan.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
        42161: `https://arbitrum-mainnet.infura.io/v3/${APP_CONFIG.INFURA_API_KEY}`,
    }
})

export function getProvider(provider: ExternalProvider | JsonRpcFetchFunc) {
    return new Web3Provider(provider)
}

export function formatAddress(value: string, length: number = 4) {
    return `${value.substring(0, length + 2)}...${value.substring(value.length - length)}`
}

export function getNetworkColor(chainId: number) {
    switch (chainId) {
        case 1: {
            return 'teal'
        }
        case 3: { // Ropsten
            return 'pink'
        }
        case 4: { // Rinkeby
            return 'yellow'
        }
        case 5: { // Goerli
            return 'blue'
        }
        case 10: { // Optmistic
            return 'red'
        }
        case 42: { // Kovan
            return 'purple'
        }
        case 42161: { // Arbitrum
            return 'cyan'
        }
        default: {
            return 'grey'
        }
    }
}

export function getNetworkName(chainId: number) {
    let name = getNetwork(chainId)?.name
    if (!name || name === 'homestead') return 'mainnet'
    if (chainId === 10) name = 'optimistic'
    if (chainId === 42161) name = 'arbitrum'

    return name
}

export function formatEtherscanLink(type: 'Account' | 'Transaction', value: string, chainId: number = 1) {
    const networkName = chainId ? 'www' : getNetwork(chainId).name

    if (chainId === 10) {
        switch (type) {
            case 'Account': {
                return `https://optimistic.etherscan.io/address/${value}`
            }
            case 'Transaction': {
                return `https://optimistic.etherscan.io/tx/${value}`
            }
        }
    }

    if (chainId === 42161) {
        switch (type) {
            case 'Account': {
                return `https://arbiscan.io/address/${value}`
            }
            case 'Transaction': {
                return `https://arbiscan.io/tx/${value}`
            }
        }
    }

    switch (type) {
        case 'Account': {
            return `https://${networkName}.etherscan.io/address/${value}`
        }
        case 'Transaction': {
            return `https://${networkName}etherscan.io/tx/${value}`
        }
    }
}

export function getEtherscanBaseApiUri(chainId: number = 1) {
    const networkName = getNetwork(chainId).name

    switch (chainId) {
        case 1: {
            return `https://api.etherscan.io/api`
        }
        case 10: {
            return `https://api-optimistic.etherscan.io/api`
        }
        case 42161: {
            return `https://api.arbiscan.io/api`
        }
        default: {
            return `https://api-${networkName}.etherscan.io/api`
        }
    }
}

export function parseBalance(value: BigNumberish, decimals = 18, decimalsToDisplay = 3) {
    return parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay)
}

export async function tryResolveName(name: string): Promise<string | undefined> {
    const provider = ethers.getDefaultProvider(undefined, {
        etherscan: APP_CONFIG.ETHERSCAN_API_KEY,
        infura: APP_CONFIG.INFURA_API_KEY,
        alchemy: APP_CONFIG.ALCHEMY_API_KEY,
        // pocket: YOUR_POCKET_APPLICATION_KEY
    })

    try {
        const resolved = await provider.resolveName(name)
        if (resolved) {
            return resolved
        }
    }
    catch (e) {
        console.log('Invalid ENS name', name)
    }
}
