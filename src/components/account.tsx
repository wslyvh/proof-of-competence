import React, { useState, useEffect } from 'react'
import { Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, Link, useClipboard, Avatar, Flex, Box, Badge, Text } from '@chakra-ui/react'
// import { useWeb3React } from '@web3-react/core'
// import { useInitialConnect } from 'hooks/useInitialConnect'
// import { injected, formatAddress, formatEtherscanLink, getNetworkName, getNetworkColor, walletConnectConnector } from 'utils/web3'
import {  formatAddress, formatEtherscanLink, getNetworkName, getNetworkColor } from 'utils/web3'

// import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { DEFAULT_COLOR_SCHEME } from 'utils/constants'
import { SmallCloseIcon, CopyIcon, ExternalLinkIcon, ChevronDownIcon } from '@chakra-ui/icons'
// import { useAvatar } from 'hooks/useAvatar'


import { useAccount, useConnect, useEnsName, useNetwork, useDisconnect } from 'wagmi'

export function Account() {
  const { chain } = useNetwork()
  const { connector, address, isConnected } = useAccount()

  // const avatar = useAvatar(address)

  const { onCopy } = useClipboard(address ?? '')

  const { connect, connectors, error, isLoading, pendingConnector } =  useConnect()
  const { disconnect } = useDisconnect()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
    { mounted && !isConnected &&
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
         colorScheme={DEFAULT_COLOR_SCHEME}>
          Connect
        </MenuButton>
        <MenuList>
          {connectors
            .filter((x) => mounted && x.ready && x.id !== connector?.id)
            .map((x) => (
              <MenuItem key={x.id} onClick={() => connect({ connector: x })}>
                {x.name}
                {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
              </MenuItem>
            ))
          }
        </MenuList>

        <Text fontSize='xs' mt={4}>
          {error && error.message }
        </Text>
      </Menu>
    }    

    { mounted && isConnected &&
      <>
      <Menu>
        {
          chain?.id &&  chain?.id > 1 &&
            <Badge mr={4}  variant="outline">{chain?.name}</Badge>
        }

        <MenuButton as={Button}>
          <Flex alignItems='center'>
            <Box mr={4}><Avatar name ={ address?.slice(2) }  size='xs' /></Box>
            <Box>{ formatAddress(address) }</Box>

            {/* <Box mr={4}><Avatar name={avatar.name} src={avatar.url} size='xs' /></Box>
              <Box>{avatar.name || formatAddress(address)}</Box> */}
          </Flex>
        </MenuButton>

        <MenuList alignItems='center'>
          <Center mt={4}>
            <Avatar size='2xl' name={ address?.slice(2) }  />{/* ensName ??  */}
            {/* <Avatar size={'2xl'} name={avatar.name} src={avatar.url} /> */}
          </Center>
          <Center mt={4}>
            <Text fontSize='xs' mx='4' mb='4'>{ address }</Text>
          </Center>
          <Center mb={4}>
            <Badge variant='outline'>{chain?.name}</Badge>
          </Center>
          <MenuItem onClick={onCopy}>
            <CopyIcon mx='2' /> Copy address
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => disconnect()}>
            <SmallCloseIcon mx='2' /> Logout
          </MenuItem>
        </MenuList>
      </Menu>
      </>
    }

    </>
  )
}
