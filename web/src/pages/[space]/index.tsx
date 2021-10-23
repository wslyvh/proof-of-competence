import React, { useEffect, useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { DEFAULT_COLOR_SCHEME, DEFAULT_REVALIDATE_PERIOD } from "utils/constants"
import { Space, Task } from "types"
import { Box, Center, Flex, Link, Square, StackDivider, VStack } from "@chakra-ui/layout"
import { useColorModeValue ,Text, Heading, Button } from '@chakra-ui/react'
import Verifier from "components/verifier"
import { useWeb3React } from "@web3-react/core"
import { verifyScore } from "utils/verify"
import { StarIcon } from "@chakra-ui/icons"
import TaskCard from "components/task"

interface Props {
  space: Space
}

interface Params extends ParsedUrlQuery {
  space: string
}

export default function SpacePage(props: Props) {
  const [score, setScore] = useState(0)
  const web3 = useWeb3React()
  const space = props.space
  const maxScore = space.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)

  useEffect(() => {
    async function getScore() {
      let score = 0
      await Promise.all(space.tasks.map(async (task: Task) => {
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

  return <>
    <div>
      <Box as='section' p='8' borderRadius="xl" bg={useColorModeValue('gray.300', 'gray.700')}>
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
        bg={useColorModeValue(`${DEFAULT_COLOR_SCHEME}.500`, `${DEFAULT_COLOR_SCHEME}.200`)} 
        color={useColorModeValue('white', 'black')}>
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
  return {
    paths: [
      { params: { space: 'useWeb3' } }
    ],
    fallback: true
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

  // const space = service.GetSpace(spaceName)

  const space = {
    name: 'useWeb3',
    description: 'Onboarding new developers into the Web3 space',
    website: 'useweb3.xyz',
    twitter: 'useWeb3',
    tasks: [{
      name: "Let's get it started!",
      description: 'Visit https://ethereum.org/wallets and install a wallet to start your journey.',
      points: 100,
      verifier: 'active-address'
    },
    {
      name: 'Original Gangster',
      description: "Score points for every month since your first transaction.",
      points: 10,
      verifier: 'first-transaction'
    },
    {
      name: 'Who dis?!',
      description: 'Register your ENS name at https://ens.domains/ with a reverse lookup.',
      points: 100,
      verifier: 'ens-reverse-lookup'
    },
    {
      name: 'Time to shine!',
      description: 'After registering your ENS name, set up your avatar to show off your NFT.',
      points: 200,
      verifier: 'ens-avatar'
    },
    {
      name: 'Training wheels',
      description: 'Deploy any kind of contract to the Rinkeby test network.',
      points: 20,
      verifier: 'deployed-contract',
      chainId: 3
    },
    {
      name: 'Tests, tests everywhere',
      description: 'Deploy any kind of contract to the Ropsten test network.',
      points: 20,
      verifier: 'deployed-contract',
      chainId: 4
    },
    {
      name: 'Master of chains',
      description: 'Deploy any kind of contract to the Goerli test network.',
      points: 20,
      verifier: 'deployed-contract',
      chainId: 5
    },
    {
      name: 'Test in production',
      description: 'Deploy any kind of contract to mainnet.',
      points: 250,
      verifier: 'deployed-contract'
    },
    {
      name: 'Getting optimistic',
      description: 'Deploy any kind of contract to the Optmistic L2 network.',
      points: 500,
      verifier: 'deployed-contract',
      chainId: 10
    },
    {
      name: 'Scaling out',
      description: 'Deploy any kind of contract to the Arbitrum L2 network.',
      points: 500,
      verifier: 'deployed-contract',
      chainId: 42161
    }] as Array<Task>
  } as Space

  return {
    props: {
      space
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
