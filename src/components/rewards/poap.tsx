import React, { useEffect, useState } from 'react'
import { Button, Flex, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react'
import { DEFAULT_COLOR_SCHEME } from 'utils/constants'
import { useWeb3React } from '@web3-react/core'
import { Quest } from 'types'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { allowMint } from 'utils/verify'

interface Props {
    quest: Quest
}

export default function Poap(props: Props) {
    const web3 = useWeb3React()
    const toast = useToast()
    const bgButton = useColorModeValue('teal.700', 'teal.700')
    const colorButton = useColorModeValue('grey.900', 'grey.100')
    const [rewardsAvailable, setRewardsAvailable] = useState(false)

    useEffect(() => {
        async function asyncEffect() { 
            if (!web3.account) return

            const eligible = await allowMint(props.quest, web3.account)
            // if (props.quest.reward === 'poap' && props.quest.params) {
            //     const response = await fetch(`/api/quests/${props.quest.id}/stats`)
            //     const stats = await response.json()
            //     setRewardsAvailable(stats.data.available > 0)
            // }
            setRewardsAvailable(eligible)
        }

        asyncEffect()
    }, [props.quest, web3.account])

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
        <Flex alignItems='center'>
            <Button bg={bgButton} color={colorButton} colorScheme={DEFAULT_COLOR_SCHEME} mr={!rewardsAvailable ? 2 : 0}
                disabled={!rewardsAvailable || !web3.account} onClick={claim}>Claim POAP</Button>

            {!rewardsAvailable &&
                <Tooltip label='No POAPs left for this quest'>
                    <InfoOutlineIcon />
                </Tooltip>
            }
        </Flex>
    )
}