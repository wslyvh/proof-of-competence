import React, { useEffect, useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { DEFAULT_COLOR_SCHEME, DEFAULT_REVALIDATE_PERIOD } from "utils/constants"
import { Journey, Task } from "types"
import { Box, Center, Flex, Link, VStack } from "@chakra-ui/layout"
import { useColorModeValue ,Text, Heading, Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from "@web3-react/core"
import { verifyScore } from "utils/verify"
import { StarIcon } from "@chakra-ui/icons"
import TaskCard from "components/task"
import { getJourneyNames, getJourneys } from "services/journey"
import { attestScore } from "services/attestation"

interface Props {
  journey: Journey
}

interface Params extends ParsedUrlQuery {
  journey: string
}

export default function JourneyPage(props: Props) {
  const [score, setScore] = useState(0)
  const bgButton = useColorModeValue('teal.700', 'teal.700')
  const colorButton = useColorModeValue('grey.900', 'grey.100')
  const bgBox = useColorModeValue('gray.300', 'gray.700')
  const bgCenter = useColorModeValue(`${DEFAULT_COLOR_SCHEME}.500`, `${DEFAULT_COLOR_SCHEME}.200`)
  const colorCenter = useColorModeValue('white', 'black')
  const toast = useToast()
  
  const web3 = useWeb3React()
  const journey = props.journey

  useEffect(() => {
    async function getScore() {
      let score = 0
      if (!props.journey) return

      await Promise.all(props.journey.tasks.map(async (task: Task) => {
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
  }, [props.journey, web3.account])

  if (!journey) return null
  
  const maxScore = journey.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)

  async function attest() {
    if (web3.account && web3.library) {
      const result = await attestScore(journey, score, web3.account, web3.library)
      if (result) {
        toast({
          title: "Transaction sent.",
          description: result,
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  return <>
    <div>
      <Box as='section' p='8' borderRadius="xl" bg={bgBox}>
        <Heading as="h2" mb='4'>{journey.name}</Heading>
        <Text fontSize="xl">{journey.description}</Text>
        
        <Flex alignItems='center'>
          <Link href={journey.website} isExternal 
            _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
            <Button size="lg" colorScheme={DEFAULT_COLOR_SCHEME} mt="24px">
              Website
            </Button>
          </Link>

          <Link href={`https://twitter.com/${journey.twitter}`} isExternal ml={4}
            _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
            <Button size="lg" mt="24px">
              @{journey.twitter}
            </Button>
          </Link>
        </Flex>
      </Box>

      <Center as='section' h="100px" my={8} borderRadius="xl"
        bg={bgCenter} 
        color={colorCenter}>
          <VStack as='section'
            align="stretch">
              <Box display='flex' alignItems='center'>
                <StarIcon mr={2} />
                <Text fontSize="xl">Score {score} / {maxScore}</Text>
              </Box>
              <Button disabled={web3.chainId !== 4}
                bg={bgButton} color={colorButton} colorScheme={DEFAULT_COLOR_SCHEME} 
                onClick={attest}>Attest (rinkeby)</Button>
          </VStack>
      </Center>

      <VStack as='section'
        spacing={4}
        align="stretch">
        <Heading as="h3" size='lg'>Tasks</Heading>

        {journey.tasks.map((task: Task, index: number) => {
          return <TaskCard key={`${task.verifier}_${index}`} task={task} address={web3.account} />
        })}
        </VStack>
    </div>
  </>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const journeys = getJourneyNames()
  
  return {
    paths: journeys.map(i => {
      return { params: { journey: i } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const journeyName = context.params?.journey
  if (!journeyName) {
    return {
      props: null,
      notFound: true,
    }
  }

  const journey = getJourneys().find(i => i.id.toLowerCase() === journeyName.toLowerCase())
  if (!journey) {
    return {
      props: null,
      notFound: true,
    }
  }
  
  return {
    props: {
      journey
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
