import { VStack, Heading, Box, LinkOverlay, LinkBox } from "@chakra-ui/layout"
import { Text } from '@chakra-ui/react'
import { GetStaticProps } from "next"
import React from "react"
import NextLink from "next/link"
import { getQuests } from "services/quests"
import { Quest } from "types"
import { DEFAULT_REVALIDATE_PERIOD, DESCRIPTION } from "utils/constants"
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { DEFAULT_TOPIC_QUEST } from 'utils/constants'

interface Props {
  quests: Array<Quest>
}

export default function HomePage(props: Props) {

  const router = useRouter()

  useEffect(() => {
    if (DEFAULT_TOPIC_QUEST) router.push(`/${DEFAULT_TOPIC_QUEST}`)
  }, [])

  if ( DEFAULT_TOPIC_QUEST ) 
    return <p>Redirecting...</p>

  return <div>
    <Box mb={4}>
      <p>{DESCRIPTION}</p>
      <p>Want to submit your own quest to PoC? Feel free to submit a <NextLink href='https://github.com/wslyvh/proof-of-competence/' passHref>PR/issue</NextLink>.</p>
    </Box>

    <VStack as='section'
      spacing={4}
      align="stretch">
      <Heading as="h3" size='lg'>Explore</Heading>

      {props.quests.map((quest: Quest) => {
        return (
          <LinkBox key={quest.id} as='article' my={4} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Heading fontSize='xl'>
              <NextLink href={`/${quest.id}`} passHref>
                <LinkOverlay>
                  {quest.name}
                </LinkOverlay>
              </NextLink>
            </Heading>
            <Text mt={4}>{quest.description}</Text>
          </LinkBox>
        )})
      }
    </VStack>
  </div>
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const quests = getQuests()
  
  return {
    props: {
      quests
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}