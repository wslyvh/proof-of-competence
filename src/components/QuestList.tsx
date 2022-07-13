import { LinkBox, LinkOverlay, Text, Heading } from "@chakra-ui/layout"
import NextLink from "next/link"
import { Quest } from "types"

interface Props {
  quests: Array<Quest>
}

export default function QuestList(props: Props) {
    const quests = props.quests

    return (
      <>
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
      </>
    )
}
