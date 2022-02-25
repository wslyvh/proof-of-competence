import { Core } from '@self.id/core'
import { Task } from 'types'

export async function verify(task: Task, address: string): Promise<boolean | number> {
  if (!address) return false

  const core = new Core({ ceramic: 'mainnet-gateway' })
  let did: string
  try {
    did = await core.getAccountDID(`${address}@eip155:1`)
  }
  catch (e) {
    return false
  }

  if (!did) return false

  try {
    let score = 0
    const basicProfile = await core.get('basicProfile', did)
    if (basicProfile) score += task.points
    
    const alsoKnownAs = await core.get('alsoKnownAs', did)
    if(alsoKnownAs) score += alsoKnownAs?.accounts?.length * task.points
    
    return score
  }
  catch (e) {
    return false
  }
}
