// utils/wagmiclient.ts
import { chain, createClient, configureChains} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { APP_CONFIG } from 'utils/config'

const alchemyId = APP_CONFIG.ALCHEMY_API_KEY

const { chains, provider, webSocketProvider } =
  configureChains(
    [chain.mainnet, chain.polygon, chain.arbitrum, chain.optimism, chain.hardhat],
    [alchemyProvider({ alchemyId }),publicProvider()],
  )

const connectors =   [
  new MetaMaskConnector({ chains }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
]

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})