import React from 'react'
import NextLink from "next/link"
import { Box, Flex, Button, useColorModeValue, Link, Spacer, useColorMode, Heading, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { TITLE } from 'utils/constants'
import { Account } from './account'
import journey from 'pages/api/journey'

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex as='header' bg={useColorModeValue('gray.100', 'gray.900')} p={4} alignItems='center'>
      <LinkBox>
        <NextLink href={'/'} passHref>
          <LinkOverlay><Heading size="md">{TITLE}</Heading></LinkOverlay>
        </NextLink>
      </LinkBox>
      
      <Spacer />
      
      <Box>
        <Account />

        <Button ml={4} onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Box>
    </Flex>
  )
}