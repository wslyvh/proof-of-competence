import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { Flex, Square, Box, Heading, Badge } from '@chakra-ui/layout'
import { Link, Text, useColorModeValue } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import  React, { useEffect, useState } from 'react'
import { Task } from 'types'
import { verifyScore } from 'utils/verify'
import Linkify from 'react-linkify'
import { getNetworkColor, getNetworkName } from 'utils/web3'

interface Props {
    task: Task
    address?: null | string
}

export default function TaskCard(props: Props) {
    const [result, setResult] = useState<boolean | number | undefined>()
    const web3 = useWeb3React()
    const task = props.task

    useEffect(() => {
        async function verify() {
            const result = await verifyScore(props.task, web3.account)

            setResult(result)
        }

        verify()
    }, [props.task, props.address, web3.account])

    return (
        <Flex>
            <Square size="100px" borderRadius="xl"
                bg={useColorModeValue('gray.100', 'gray.900')}>
                    {typeof result === 'boolean' && result && <CheckIcon color='teal' boxSize={6} />}
                    {typeof result === 'boolean' && !result && <SmallCloseIcon color='grey' boxSize={6} />}
                    {typeof result === 'number' && String(result)}
                    {result === undefined && ''}
            </Square>

            <Box flex="1" ml={4} padding={3}>
                <Heading fontSize="xl">
                    {task.name} ({task.points} points) 
                    {typeof result === 'boolean' && result === true && <Badge colorScheme="teal" ml={2} p={1}>completed</Badge>}
                    {typeof result === 'number' && result > 0 && <Badge colorScheme="teal" ml={2} p={1}>in progress</Badge>}
                    {!result && <Badge colorScheme={getNetworkColor(task.chainId ?? 1)} ml={2} p={1} variant="outline">{getNetworkName(task.chainId ?? 1)}</Badge>}
                </Heading>
                
                <Text mt={2}>
                    <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                        <Link key={key} isExternal textDecoration='underline' href={decoratedHref}>{decoratedText}</Link>)}>
                        {task.description}
                    </Linkify>
                </Text>
            </Box>
        </Flex>
    )
}