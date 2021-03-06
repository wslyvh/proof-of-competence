import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number> {
    if (!address) return false
    if (!verifier.params['space']) return false

    try {
        const space = verifier.params['space'] as string
        const response = await fetch('https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    delegations(where: {space: "${space}", delegator: "${address.toLowerCase()}"}) {
                      delegate
                      delegator
                      space
                    }
                }`,
            })
        })

        const data = await response.json()
        const delegations = Array.from(data.data.delegations)

        if (delegations.length === 0) return false
        return delegations.length > 0
    }
    catch (e) {
        return false
    }
}
