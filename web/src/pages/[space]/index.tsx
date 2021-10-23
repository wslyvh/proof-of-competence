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
        {space.tasks.map((task: Task, index: number) => {
          return <div key={`${task.verifier}_${index}`}>
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
      name: "Let's get it started!",
      description: 'Visit https://ethereum.org/wallets and install a wallet to start your journey.',
      points: 100,
      verifier: 'active-address'
    },
    {
      name: 'Original Gangster',
      description: "Show-off time! Score points for every month since your first transaction.",
      points: 10,
      verifier: 'first-transaction',
      chainId: 1
    },
    {
      name: 'Who dis?!',
      description: 'Register your ENS name at https://ens.domains/ and set the reverse lookup to your address.',
      points: 100,
      verifier: 'ens-reverse-lookup'
    },
    {
      name: 'Who dis?!',
      description: 'After registering your ENS name, set up your avatar to show off your NFT.',
      points: 200,
      verifier: 'ens-avatar'
    },
    {
      name: 'With the training wheels',
      description: 'Deploy any kind of contract to the Rinkeby test network.',
      points: 20,
      verifier: 'deployed-contract',
      chainId: 3
    },
    {
      name: 'Tests, tests everywhere',
      description: 'Deploy any kind of contract to the Rinkeby test network.',
      points: 20,
      verifier: 'deployed-contract',
      chainId: 4
    },
    {
      name: 'Testing in prod',
      description: 'Deploy any kind of contract to mainnet.',
      points: 250,
      verifier: 'deployed-contract'
    },
    {
      name: 'Getting optimistic',
      description: 'Deploy any kind of contract to the Optmistic L2 network.',
      points: 500,
      verifier: 'deployed-contract',
      chainId: 10
    },
    {
      name: 'Need more scale',
      description: 'Deploy any kind of contract to the Arbitrum L2 network.',
      points: 500,
      verifier: 'deployed-contract',
      chainId: 42161
    }] as Array<Task>
  } as Space

  return {
    props: {
      space
    },
    revalidate: DEFAULT_REVALIDATE_PERIOD
  }
}
