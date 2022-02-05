import React from 'react'
import { Button, useColorModeValue, useToast } from '@chakra-ui/react'
import { DEFAULT_COLOR_SCHEME } from 'utils/constants'
import { useWeb3React } from '@web3-react/core'
import { Quest } from 'types'

interface Props {
    quest: Quest
}

export default function Poap(props: Props) {
    const web3 = useWeb3React()
    const toast = useToast()
    const bgButton = useColorModeValue('teal.700', 'teal.700')
    const colorButton = useColorModeValue('grey.900', 'grey.100')

    async function claim() {
        if (web3.account) {
            const response = await fetch(`/api/quests/${props.quest.id}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account: web3.account
                }),
            })

            const body = await response.json()
            toast({
                title: response.status === 200 ? 'Your POAP will be added to your account soon' : body.message,
                status: response.status === 200 ? 'success' : 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <Button bg={bgButton} color={colorButton} colorScheme={DEFAULT_COLOR_SCHEME}
            disabled={!web3.account} onClick={claim}>Claim POAP</Button>
    )
}