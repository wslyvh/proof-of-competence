import { VStack, Heading, Box } from "@chakra-ui/layout"
import { GetStaticProps } from "next"
import React from "react"
import NextLink from "next/link"
import { getQuests } from "services/quests"
import { Quest } from "types"
import { DEFAULT_REVALIDATE_PERIOD, DESCRIPTION } from "utils/constants"
import QuestList from "components/QuestList"

interface Props {
  quests: Array<Quest>
}

export default function HomePage(props: Props) {

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
