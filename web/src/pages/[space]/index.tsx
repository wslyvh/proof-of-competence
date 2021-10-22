import React, { useEffect, useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { DEFAULT_REVALIDATE_PERIOD } from "utils/constants"
import { Space, Task } from "types"
import { Link } from "@chakra-ui/layout"
import Verifier from "components/verifier"
import { useWeb3React } from "@web3-react/core"
import { verifyScore } from "utils/verify"

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

  useEffect(() => {
    async function getScore() {
      let score = 0
      await Promise.all(space.tasks.map(async (task: Task) => {
        const result = await verifyScore(task, web3.library, web3.account)

        if (result && typeof result === 'boolean') {
          score += task.points
        }
        if (result && typeof result === 'number') {
          score += task.points * result
        }
      }))

      setScore(score)
    }

    getScore()
  }, [props.space, web3.account])

  return <>
    <div>
      <section>
        <h2>{space.name}</h2>
        <p>{space.description}</p>
        {space.website && 
        <p>
            <Link href={space.website} isExternal>{space.website}</Link>
        </p>
        }
        {space.twitter && 
        <p>
            <Link href={`https://twitter.com/${space.twitter}`} isExternal>@{space.twitter}</Link>
        </p>
        }
      </section>

      <br/><hr/><br/>

      <div>Your score: {score}</div>

      <br/><hr/><br/>

      <section>
        {space.tasks.map((task: Task) => {
          return <div key={task.verifier}>
              <p>{task.name} ({task.points} points)</p>
              <p>{task.description}</p>
              <Verifier task={task} address={web3.account} />
              <hr/>
            </div>
        })}
      </section>
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
      name: 'Install an Ethereum wallet',
      description: 'Visit https://ethereum.org/wallets and install a wallet to start your journey.',
      points: 100,
      verifier: 'active-address'
    },{
      name: 'Register ENS name',
      description: 'Register your ENS name at https://ens.domains/ and set the reverse lookup to your address.',
      points: 100,
      verifier: 'ens-reverse-lookup'
    },{
      name: 'True task',
      description: 'Task always verifies true for testing purposes.',
      points: 10,
      verifier: 'true'
    },{
      name: 'False task',
      description: 'Task always verifies false for testing purposes.',
      points: 10,
      verifier: 'false'
    }] as Array<Task>
  } as Space

  return {
    props: {
      space
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
