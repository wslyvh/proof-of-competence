import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number> {
  if (!address) return false

  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          submissions(where: {id: "${address.toLowerCase()}"}) {
            id
            name
            status
            registered
            removed
          }
        }`
      })
    })

    const data = await response.json()
    const submissions = Array.from(data.data.submissions)
    if (submissions.length === 0) return false

    return submissions.some((i: any) => i.registered && !i.removed)
  }
  catch (e) {
    return false
  }
}
