import React, { useEffect, useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { DEFAULT_COLOR_SCHEME, DEFAULT_REVALIDATE_PERIOD } from "utils/constants"
import { Space, Task } from "types"
import { Box, Center, Flex, Link, VStack } from "@chakra-ui/layout"
import { useColorModeValue ,Text, Heading, Button } from '@chakra-ui/react'
import { useWeb3React } from "@web3-react/core"
import { verifyScore } from "utils/verify"
import { StarIcon } from "@chakra-ui/icons"
import TaskCard from "components/task"
import { getSpaceNames, getSpaces } from "services/spaces"

interface Props {
  space: Space
}

interface Params extends ParsedUrlQuery {
  space: string
}

export default function SpacePage(props: Props) {
  const [score, setScore] = useState(0)
  const bgBox = useColorModeValue('gray.300', 'gray.700')
  const bgCenter = useColorModeValue(`${DEFAULT_COLOR_SCHEME}.500`, `${DEFAULT_COLOR_SCHEME}.200`)
  const colorCenter = useColorModeValue('white', 'black')
  
  const web3 = useWeb3React()
  const space = props.space

  useEffect(() => {
    async function getScore() {
      let score = 0
      if (!props.space) return

      await Promise.all(props.space.tasks.map(async (task: Task) => {
        const result = await verifyScore(task, web3.account)
        if (result && typeof result === 'boolean') {
          score += task.points
        }
        if (result && typeof result === 'number') {
          score += result
        }
      }))

      setScore(score)
    }

    getScore()
  }, [props.space, web3.account])

  if (!space) return null
  
  const maxScore = space.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)

  return <>
    <div>
      <Box as='section' p='8' borderRadius="xl" bg={bgBox}>
        <Heading as="h2" mb='4'>{space.name}</Heading>
        <Text fontSize="xl">{space.description}</Text>
        
        <Flex alignItems='center'>
          <Link href={space.website} isExternal 
            _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
            <Button size="lg" colorScheme={DEFAULT_COLOR_SCHEME} mt="24px">
              Website
            </Button>
          </Link>

          <Link href={`https://twitter.com/${space.twitter}`} isExternal ml={4}
            _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
            <Button size="lg" mt="24px">
              @{space.twitter}
            </Button>
          </Link>
        </Flex>
      </Box>

      <Center as='section' h="100px" my={8} borderRadius="xl"
        bg={bgCenter} 
        color={colorCenter}>
          <StarIcon mr={2} />
          <Text fontSize="xl">Score {score} / {maxScore}</Text>
      </Center>

      <VStack as='section'
        spacing={4}
        align="stretch">
        <Heading as="h3" size='lg'>Tasks</Heading>

        {space.tasks.map((task: Task, index: number) => {
          return <TaskCard key={`${task.verifier}_${index}`} task={task} address={web3.account} />
        })}
        </VStack>
    </div>
  </>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const spaces = getSpaceNames()
  
  return {
    paths: spaces.map(i => {
      return { params: { space: 'useWeb3' } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const spaceName = context.params?.space
  if (!spaceName) {
    return {
      props: null,
      notFound: true,
    }
  }

  const space = getSpaces().find(i => i.id.toLowerCase() === spaceName.toLowerCase())
  if (!space) {
    return {
      props: null,
      notFound: true,
    }
  }
  
  return {
    props: {
      space
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
