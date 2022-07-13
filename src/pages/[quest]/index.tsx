import React, { useEffect, useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { Box, Center, VStack } from "@chakra-ui/layout"
import { useColorModeValue ,Text, Heading } from '@chakra-ui/react'
import { StarIcon } from "@chakra-ui/icons"
import { useAccount } from 'wagmi'

import { Quest, Task } from "types"
import Poap from "components/rewards/poap"
import QuestSocial from "components/QuestSocial"
import TaskCard from "components/TaskCard"
import { getQuestNames, getQuests } from "services/quests"
import { verifyScore } from "utils/verify"

import { DEFAULT_COLOR_SCHEME, DEFAULT_REVALIDATE_PERIOD } from "utils/constants"

interface Props {
  quest: Quest
}

interface Params extends ParsedUrlQuery {
  quest: string
}

export default function QuestPage(props: Props) {
  if (!props.quest) return null

  const quest = props.quest
  const maxScore = quest.tasks.map(i => i.points).reduce((acc, i) => acc + i, 0)

  const [score, setScore] = useState(0)
  const bgBox = useColorModeValue('gray.300', 'gray.700')
  const bgCenter = useColorModeValue(`${DEFAULT_COLOR_SCHEME}.500`, `${DEFAULT_COLOR_SCHEME}.200`)
  const colorCenter = useColorModeValue('white', 'black')
  
  const { address } = useAccount()

  useEffect(() => {
    async function getScoreSum() {
      let score = 0
      if (!quest) return

      await Promise.all(quest.tasks.map(async (task: Task) => {
        const result = await verifyScore(task, address)
        if (result && typeof result === 'boolean') {
          score += task.points
        }
        if (result && typeof result === 'number') {
          score += result
        }
      }))

      setScore(score)
    }

    getScoreSum()
  }, [quest, address])

  return <>
    <div>
      <Box as='section' p='8' borderRadius="xl" bg={bgBox}>
        <Heading as="h2" mb='4'>{quest.name}</Heading>
        <Text fontSize="xl">{quest.description}</Text>
        <QuestSocial quest={quest} />
      </Box>

      <Center as='section' py={4} my={8} borderRadius="xl" bg={bgCenter} color={colorCenter}>
          <VStack as='section' align="stretch" alignItems='center'>
              <Box display='flex' alignItems='center'>
                <StarIcon mr={2} />
                <Text fontSize="xl">Score {score} / {maxScore}</Text>
              </Box>

              {quest.reward === 'poap' && <Poap quest={quest} />}
          </VStack>
      </Center>

      <VStack as='section' spacing={4} align="stretch">
        <Heading as="h3" size='lg'>Tasks</Heading>

        {quest.tasks.map((task: Task, index: number) => {
          return <TaskCard key={`${task.name}_${index}`} task={task}  address={address}/>
        })}

      </VStack>
    </div>
  </>
}

/*
  Next.js:  getStaticPaths
*/
export const getStaticPaths: GetStaticPaths = async () => {
  const quests = getQuestNames()
  
  return {
    paths: quests.map(i => {
      return { params: { quest: i } }
    }),
    fallback: false
  }
}

/*
  Next.js:  getStaticProps
*/
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
