import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
// import { Web3ReactProvider } from '@web3-react/core'
import { SEO } from 'components/seo'
// import { getProvider } from 'utils/web3'
import { Layout } from 'components/layout'
import { WagmiConfig } from 'wagmi'
import { client } from 'utils/wagmiclient'

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider>
        <WagmiConfig client={client}>
          <SEO />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
      </ChakraProvider>
  )
}
