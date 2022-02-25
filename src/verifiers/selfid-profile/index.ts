import { Core } from '@self.id/core'
import { Task } from 'types'

export async function verify(task: Task, address: string): Promise<boolean | number> {
  if (!address) return false

  try {
    const core = new Core({ ceramic: 'mainnet-gateway' })
    const did = await core.getAccountDID(`${address}@eip155:1`)
    const basicProfile = await core.get('basicProfile', did)

    if (task.params && task.params['connections']) {
      const minConnections = task.params['connections'] as number
      const alsoKnownAs = await core.get('alsoKnownAs', did)
      return alsoKnownAs.accounts?.length >= minConnections
    }

    return !!basicProfile
  }
  catch (e) {
    return false
  }
}
