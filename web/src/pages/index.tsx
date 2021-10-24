import { VStack, Heading, Box, LinkOverlay, LinkBox } from "@chakra-ui/layout"
import { Text } from '@chakra-ui/react'
import { GetStaticProps } from "next"
import React from "react"
import NextLink from "next/link"
import { getJourneys } from "services/journey"
import { Journey } from "types"
import { DEFAULT_REVALIDATE_PERIOD, DESCRIPTION } from "utils/constants"

interface Props {
  journeys: Array<Journey>
}

export default function HomePage(props: Props) {
  return <div>
    <Box mb={4}>
      <p>{DESCRIPTION}</p>
    </Box>

    <VStack as='section'
      spacing={4}
      align="stretch">
      <Heading as="h3" size='lg'>Explore</Heading>

      {props.journeys.map((journey: Journey) => {
        return (
          <LinkBox key={journey.id} as='article' my={4} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Heading fontSize='xl'>
              <NextLink href={`/${journey.id}`} passHref>
                <LinkOverlay>
                  {journey.name}
                </LinkOverlay>
              </NextLink>
            </Heading>
            <Text mt={4}>{journey.description}</Text>
          </LinkBox>
        )})
      }
    </VStack>
  </div>
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const journeys = getJourneys()
  
  return {
    props: {
      journeys
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}