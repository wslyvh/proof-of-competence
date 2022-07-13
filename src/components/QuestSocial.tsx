import { Quest } from "types"
import { Flex, Link } from "@chakra-ui/layout"
import { Button } from '@chakra-ui/react'
import { DEFAULT_COLOR_SCHEME } from "utils/constants"

interface Props {
    quest: Quest
  }

export default function QuestSocial(props: Props) {
    const quest = props.quest

    return (
        <>
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
        </>
    )
}
