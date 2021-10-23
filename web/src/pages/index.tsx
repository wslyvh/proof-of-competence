import { VStack, Heading, Box, LinkOverlay, LinkBox } from "@chakra-ui/layout"
import { Text, useColorModeValue } from '@chakra-ui/react'
import { GetStaticProps } from "next"
import React from "react"
import { getSpaces } from "services/spaces"
import { Space } from "types"
import { DEFAULT_REVALIDATE_PERIOD, DESCRIPTION } from "utils/constants"

interface Props {
  spaces: Array<Space>
}

export default function HomePage(props: Props) {
  return <div>
    <Box mb={4}>
      <p>{DESCRIPTION}</p>
    </Box>

    <VStack as='section'
      spacing={4}
      align="stretch">
      <Heading as="h3" size='lg'>Pathways</Heading>

      {props.spaces.map((space: Space) => {
        return (
          <LinkBox key ={space.id} my={4} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Heading fontSize='xl'>
              <LinkOverlay href={`/${space.id}`}>
                {space.name}
              </LinkOverlay>
            </Heading>
            <Text mt={4}>{space.description}</Text>
          </LinkBox>
        )})
      }
    </VStack>
  </div>
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const spaces = getSpaces()
  
  return {
    props: {
      spaces
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}