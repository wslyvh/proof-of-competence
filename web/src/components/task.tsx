import { CheckCircleIcon, CheckIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { Flex, Square, Box, Heading, Badge } from '@chakra-ui/layout'
import { Link, Text, useColorModeValue } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import  React, { useEffect, useState } from 'react'
import { Task } from 'types'
import { verifyScore } from 'utils/verify'
import Linkify from 'react-linkify'

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
    }, [props])

    return (
        <Flex>
            <Square size="100px" borderRadius="xl"
                bg={useColorModeValue('gray.100', 'gray.900')}>
                    {typeof result === 'boolean' && result && <CheckIcon color='teal' boxSize={6} />}
                    {typeof result === 'boolean' && !result && <SmallCloseIcon color='grey' boxSize={6} />}
                    {typeof result === 'number' && String(result)}
                    {result === undefined && ''}
            </Square>

            <Box flex="1" ml={4} padding={4}>
                <Heading fontSize="xl">
                    {task.name} ({task.points} points) 
                    {(result && result === true) || (result && result > 0) && <Badge colorScheme="teal">completed</Badge>}
                </Heading>
                <Text mt={4}>
                    <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                        <Link key={key} isExternal textDecoration='underline' href={decoratedHref}>{decoratedText}</Link>)}>
                        {task.description}
                    </Linkify>
                </Text>
            </Box>
        </Flex>
    )
}