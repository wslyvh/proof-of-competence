import React, { useEffect, useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { DEFAULT_COLOR_SCHEME, DEFAULT_REVALIDATE_PERIOD } from "utils/constants"
import { Quest, Task } from "types"
import { Box, Center, Flex, Link, VStack } from "@chakra-ui/layout"
import { useColorModeValue ,Text, Heading, Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from "@web3-react/core"
import { verifyScore } from "utils/verify"
import { StarIcon } from "@chakra-ui/icons"
import TaskCard from "components/task"
import { getQuestNames, getQuests } from "services/quests"
import { attestScore } from "services/attestation"
import Poap from "components/rewards/poap"

interface Props {
  quest: Quest
}

interface Params extends ParsedUrlQuery {
  quest: string
}

export default function QuestPage(props: Props) {
  const [score, setScore] = useState(0)
  const bgButton = useColorModeValue('teal.700', 'teal.700')
  const colorButton = useColorModeValue('grey.900', 'grey.100')
  const bgBox = useColorModeValue('gray.300', 'gray.700')
  const bgCenter = useColorModeValue(`${DEFAULT_COLOR_SCHEME}.500`, `${DEFAULT_COLOR_SCHEME}.200`)
  const colorCenter = useColorModeValue('white', 'black')
  const toast = useToast()
  
  const web3 = useWeb3React()
  const quest = props.quest

  useEffect(() => {
    async function getScore() {
      let score = 0
      if (!props.quest) return

      await Promise.all(props.quest.tasks.map(async (task: Task) => {
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
  }, [props.quest, web3.account])

  if (!quest) return null
  
  const maxScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)

  async function attest() {
    if (web3.account && web3.library) {
      const result = await attestScore(quest, score, web3.account, web3.library)
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
        <Heading as="h2" mb='4'>{quest.name}</Heading>
        <Text fontSize="xl">{quest.description}</Text>
        
        {(quest.website || quest.twitter) && (
        <Flex alignItems={['stretch', 'center']} flexDirection={['column', 'row']}>
          {quest.website && (
            <Link href={quest.website} isExternal mr={[0, 4]}
              _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
              <Button size="lg" width={['100%']} colorScheme={DEFAULT_COLOR_SCHEME} mt="24px">
                Website
              </Button>
            </Link>
          )}

          {quest.twitter && (
            <Link href={`https://twitter.com/${quest.twitter}`} isExternal
              _hover={{ textDecoration: 'none'}} _focus={{ textDecoration: 'none'}}>
              <Button size="lg" width={['100%']} mt="24px">
                @{quest.twitter}
              </Button>
            </Link>
          )}
        </Flex>
        )}
      </Box>

      <Center as='section' py={4} my={8} borderRadius="xl"
        bg={bgCenter} 
        color={colorCenter}>
          <VStack as='section'
            align="stretch" alignItems='center'>
              <Box display='flex' alignItems='center'>
                <StarIcon mr={2} />
                <Text fontSize="xl">Score {score} / {maxScore}</Text>
              </Box>

              {/* ethereum attestation service (EAS) on rinkeby */}
              {quest.reward === 'self-attest' && 
                <Button disabled={web3.chainId !== 4}
                  bg={bgButton} color={colorButton} colorScheme={DEFAULT_COLOR_SCHEME} 
                  onClick={attest}>Attest (rinkeby)</Button>
              }

              {/* POAP */}
              {quest.reward === 'poap' && <Poap quest={quest} />}

          </VStack>
      </Center>

      <VStack as='section'
        spacing={4}
        align="stretch">
        <Heading as="h3" size='lg'>Tasks</Heading>

        {quest.tasks.map((task: Task, index: number) => {
          return <TaskCard key={`${task.name}_${index}`} task={task} address={web3.account} />
        })}
        </VStack>
    </div>
  </>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const quests = getQuestNames()
  
  return {
    paths: quests.map(i => {
      return { params: { quest: i } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const questName = context.params?.quest
  if (!questName) {
    return {
      props: null,
      notFound: true,
    }
  }

  const quest = getQuests().find(i => i.id.toLowerCase() === questName.toLowerCase())
  if (!quest) {
    return {
      props: null,
      notFound: true,
    }
  }

  return {
    props: {
      quest,
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
