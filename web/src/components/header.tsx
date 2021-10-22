import React from 'react'
import { Box, Flex, Button, useColorModeValue, Link, Spacer, useColorMode, Heading } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { TITLE } from 'utils/constants'
import { Account } from './account'

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex as='header' bg={useColorModeValue('gray.100', 'gray.900')} p={4} alignItems='center'>
      <Box>
        <Link href="/" _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
          <Heading size="md">{TITLE}</Heading>
        </Link>
      </Box>
      
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