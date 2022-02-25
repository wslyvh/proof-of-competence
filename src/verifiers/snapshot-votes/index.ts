import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number> {
    if (!address) return false
    if (!verifier.params['space']) return false

    try {
        const space = verifier.params['space'] as string
        const response = await fetch('https://hub.snapshot.org/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query GetVotes($address: String!, $space: String!) {
                    votes (
                      where: {
                        voter: $address
                        space: $space
                      }
                    ) {
                      id
                      created
                      proposal {
                        id
                      }
                    }
                }`,
                variables: {
                    address: address,
                    space: space
                },
            })
        })

        const data = await response.json()
        const votes = Array.from(data.data.votes)
        if (votes.length === 0) return false

        const proposals = Array.isArray(verifier.params['propsals']) ? Array.from(verifier.params['propsals']) : []
        if (proposals.length > 0) {
            return votes.map((i: any) => i.proposal.id).filter(i => proposals.includes(i)).length * task.points
        }

        return votes.length * task.points
    }
    catch (e) {
        return false
    }
}
