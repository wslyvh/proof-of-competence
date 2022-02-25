import { Task, Verifier } from "types"

export async function verify(task: Task, verifier: Verifier, address: string): Promise<boolean | number>
{
    return !!address
}