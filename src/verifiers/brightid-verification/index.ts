import { Task } from 'types'

export async function verify(task: Task, address: string): Promise<boolean | number> {
  if (!address) return false

  try {
    const response = await fetch(`/api/verifiers/brightid/${address}`)
    const body = await response.json()

    return body?.data?.[0].unique ?? false
  }
  catch (e) {
    console.log(e)
    return false
  }
}
