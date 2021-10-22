import React, { ReactNode } from 'react'
import { Center, Link, useColorModeValue } from '@chakra-ui/react'
import Header from './header'

type Props = {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <div>
      <Header />

      <div>
        {props.children}
      </div>

      <Center as="footer" bg={useColorModeValue('gray.300', 'gray.700')} p={6}>
        <p>
          Created by <Link href="https://twitter.com/wslyvh" isExternal>@wslyvh</Link>.
        </p>
      </Center>
    </div>
  )
}
