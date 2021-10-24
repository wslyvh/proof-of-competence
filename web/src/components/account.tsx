import React from 'react'
import { Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, Link, useClipboard, Avatar, Flex, Box, Badge } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { useInitialConnect } from 'hooks/useInitialConnect'
import { injected, formatAddress, formatEtherscanLink, getNetworkName, getNetworkColor, walletConnectConnector } from 'utils/web3'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { DEFAULT_COLOR_SCHEME } from 'utils/constants'
import { SmallCloseIcon, CopyIcon, ExternalLinkIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useAvatar } from 'hooks/useAvatar'

export function Account() {
  useInitialConnect()
  const web3Connect = useWeb3React()
  const avatar = useAvatar()
  const { onCopy } = useClipboard(web3Connect.account ?? '')

  function connect() {
    web3Connect.activate(injected, (error) => {
      if (error instanceof UserRejectedRequestError) {
        // ignore user rejected error
      } else {
        web3Connect.setError(error)
      }
    }, false)
  }

  function walletConnect() {
    web3Connect.activate(walletConnectConnector, (error) => {
      if (error instanceof UserRejectedRequestError) {
        // ignore user rejected error
      } else {
        web3Connect.setError(error)
      }
    }, false)    
  }

  function disconnect() {
    web3Connect.deactivate()
  }

  {/* {web3Connect.error && <p>{web3Connect.error.name}: {web3Connect.error.message}</p>} */}

  return (
    <>
      {!web3Connect.active && 
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme={DEFAULT_COLOR_SCHEME}>
            Connect
          </MenuButton>
          <MenuList>
            <MenuItem onClick={connect}>Metamask</MenuItem>
            <MenuItem onClick={walletConnect}>WalletConnect</MenuItem>
          </MenuList>
        </Menu>
      }

      {web3Connect.active && typeof web3Connect.account === 'string' && typeof web3Connect.chainId === 'number' && 
        <>
        <Menu>
          {web3Connect.chainId > 1 && <Badge mr={4} colorScheme={getNetworkColor(web3Connect.chainId)} variant="outline">{getNetworkName(web3Connect.chainId)}</Badge>}
          
          <MenuButton as={Button}>
            <Flex alignItems='center'>
              <Box mr={4}><Avatar name={avatar.name} src={avatar.url} size='xs' /></Box>
              <Box>{avatar.name || formatAddress(web3Connect.account)}</Box>
            </Flex>
          </MenuButton>

          <MenuList alignItems={'center'}>
            <Center my={4}>
              <Avatar size={'2xl'} name={avatar.name} src={avatar.url} />
            </Center>

            <Center mt={4}>
              <p>{formatAddress(web3Connect.account, 6)}</p>
            </Center>

            <Center mb={4}>
              <Badge colorScheme={getNetworkColor(web3Connect.chainId)} variant="outline">{getNetworkName(web3Connect.chainId)}</Badge>
            </Center>

            <MenuDivider />

            <MenuItem onClick={onCopy}>
              <CopyIcon mx="2" /> Copy address
            </MenuItem>
            <Link 
              isExternal 
              href={formatEtherscanLink('Account', web3Connect.account, web3Connect.chainId)}
              _hover={{ textDecoration: 'none'}}>
              <MenuItem>
                <ExternalLinkIcon mx="2" /> View on Etherscan
              </MenuItem>
            </Link>
            <MenuItem onClick={disconnect}>
              <SmallCloseIcon mx='2' /> Logout
            </MenuItem>
          </MenuList>
        </Menu>
        </>
      }
    </>
  )
}
