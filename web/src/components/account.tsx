import React from 'react'
import { Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Center, Link, useClipboard } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { useInitialConnect } from 'hooks/useInitialConnect'
import { injected, formatAddress, formatEtherscanLink, getNetworkName } from 'utils/web3'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { DEFAULT_COLOR_SCHEME } from 'utils/constants'
import { SmallCloseIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'

export function Account() {
  useInitialConnect()
  const web3Connect = useWeb3React()
  const { hasCopied, onCopy } = useClipboard(web3Connect.account ?? '')

  function connect() {
    web3Connect.activate(injected, (error) => {
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
        <Button colorScheme={DEFAULT_COLOR_SCHEME} onClick={connect}>
          Connect
        </Button>
      }

      {web3Connect.active && typeof web3Connect.account === 'string' && typeof web3Connect.chainId === 'number' && 
        <>
        <Menu>
          <MenuButton as={Button}>
            <span>{formatAddress(web3Connect.account)}</span>
          </MenuButton>

          <MenuList alignItems={'center'}>
            <Center mt={4}>
              <p>{formatAddress(web3Connect.account, 6)}</p>
            </Center>

            <Center mb={4}>
              <small>{getNetworkName(web3Connect.chainId)}</small>
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
