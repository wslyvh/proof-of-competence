import React, { ReactNode } from 'react'
import { Container } from '@chakra-ui/react'
import Header from './header'
import Footer from './footer'

type Props = {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <>
      <Header />
      <Container maxW="container.md" py='8'>
        {props.children}
      </Container>
      <Footer />
    </>
  )
}
