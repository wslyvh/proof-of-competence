import { Task } from "types"

export async function verify(task: Task, address: string): Promise<boolean | number>
{
    const nr = Math.floor((Math.random() * 10) + 1)
    return nr * task.points
}