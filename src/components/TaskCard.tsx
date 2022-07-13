import  React from 'react'
import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { Flex, Square, Box, Heading, Badge } from '@chakra-ui/layout'
import { Link, Text, useColorModeValue } from '@chakra-ui/react'
import Linkify from 'react-linkify'

import { Task } from 'types'
import { getChainId } from 'utils/verify'
import { getNetworkColor, getNetworkName } from 'utils/web3'

interface Props {
    task: Task,
    address?: string | undefined
}

export default function TaskCard(props: Props) {

    const task = props.task
    const result = props.task.result

    const bgColor = useColorModeValue('gray.100', 'gray.900')

    return (
        <Flex>
            {props.address?
            <Square size="100px" borderRadius="xl" bg={bgColor}>
                    {typeof result === 'boolean' && result && <CheckIcon color='teal' boxSize={6} />}
                    {typeof result === 'boolean' && !result && <SmallCloseIcon color='grey' boxSize={6} />}
                    {typeof result === 'number' && String(result)}
                    {task.result === undefined && ''}
            </Square>
            :
            <Square size="100px" borderRadius="xl" bg={bgColor}>
                <SmallCloseIcon color='grey' boxSize={6} />
            </Square>
            }

            <Box flex="1" ml={4} padding={3}>
                <Heading fontSize="xl">
                    {task.name} ({task.points} points) 
                    {typeof result === 'boolean' && result === true && <Badge colorScheme="teal" ml={2} p={1}>completed</Badge>}
                    {typeof result === 'number' && result > 0 && <Badge colorScheme="teal" ml={2} p={1}>in progress</Badge>}
                    {!result && <Badge colorScheme={getNetworkColor(getChainId(task))} ml={2} p={1} variant="outline">{getNetworkName(getChainId(task))}</Badge>}
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
