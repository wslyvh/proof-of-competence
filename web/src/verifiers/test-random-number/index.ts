import { Task } from "types"

export async function verify(task: Task, address: string): Promise<boolean | number>
{
    return Math.floor((Math.random() * 10) + 1)
}