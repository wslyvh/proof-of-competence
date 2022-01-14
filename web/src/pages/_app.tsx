import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import { Web3ReactProvider } from '@web3-react/core'
import { SEO } from 'components/seo'
import { getProvider } from 'utils/web3'
import { Layout } from 'components/layout'
import PlausibleProvider from 'next-plausible'
import { DOMAIN } from 'utils/constants'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain={DOMAIN} trackOutboundLinks>
      <ChakraProvider>
        <Web3ReactProvider getLibrary={getProvider}>
          <SEO />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Web3ReactProvider>
      </ChakraProvider>
    </PlausibleProvider>
  )
}
