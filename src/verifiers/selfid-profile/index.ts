import { Core } from '@self.id/core'
import { Task, Verifier } from 'types'

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number> {
  if (!address) return false

  try {
    const core = new Core({ ceramic: 'mainnet-gateway' })
    const did = await core.getAccountDID(`${address}@eip155:1`)
    const basicProfile = await core.get('basicProfile', did)

    if (verifier.params && verifier.params['connections']) {
      const minConnections = verifier.params['connections'] as number
      const alsoKnownAs = await core.get('alsoKnownAs', did)
      return alsoKnownAs.accounts?.length >= minConnections
    }

    return !!basicProfile
  }
  catch (e) {
    return false
  }
}
