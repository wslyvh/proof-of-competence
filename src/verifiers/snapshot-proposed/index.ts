import { Task } from 'types'

export async function verify(task: Task, address: string): Promise<boolean | number> {
    if (!address) return false
    if (!task.params['space']) return false

    try {
        const space = task.params['space'] as string
        const response = await fetch('https://hub.snapshot.org/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `query GetProposals($address: String!, $space: String!) {
                    proposals (
                      where:{
                        author: $address
                        space: $space
                      }
                    ) {
                      id
                      title
                      state
                      created
                    }
                }`,
                variables: {
                    address: address,
                    space: space
                },
            })
        })

        const data = await response.json()
        const proposals = Array.from(data.data.proposals)
        if (proposals.length === 0) return false

        return proposals.length * task.points
    }
    catch (e) {
        return false
    }
}
