import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from "next"
import NextLink from "next/link"

import { VStack, Heading, Box } from "@chakra-ui/layout"

import QuestList from "components/QuestList"
import { getQuests } from "services/quests"
import { Quest } from "types"
import { DEFAULT_REVALIDATE_PERIOD, DESCRIPTION, DEFAULT_TOPIC_QUEST } from "utils/constants"

interface Props {
  quests: Array<Quest>
}

/*
  HomePage
*/
export default function HomePage(props: Props) {


  const router = useRouter()

  useEffect(() => {
    if (DEFAULT_TOPIC_QUEST) router.replace(`/${DEFAULT_TOPIC_QUEST}`)
  }, [router])

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

      {/* Quest list */}
      <QuestList quests = {props.quests} />

    </VStack>
  </div>
}

/*
  Next.js: getStaticProps
*/
export const getStaticProps: GetStaticProps<Props> = async () => {
  const quests = getQuests()
  
  return {
    props: {
      quests
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
