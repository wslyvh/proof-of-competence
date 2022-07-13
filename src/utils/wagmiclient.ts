// utils/wagmiclient.ts
import { chain, createClient, configureChains} from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const { chains, provider, webSocketProvider } =
  configureChains(
    [chain.mainnet, chain.polygon, chain.arbitrum, chain.optimism, chain.hardhat],
    [publicProvider()],
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