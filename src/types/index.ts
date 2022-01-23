export interface Journey {
    id: string
    name: string
    version: number
    description: string
    website?: string
    twitter?: string
    tasks: Array<Task>
    reward?: 'none' | 'self-attest'
}

export interface Task {
    name: string
    description: string
    points: number
    chainId?: number
    verifier: string
    params: { [key: string]: string | boolean | number | Array<string> }
}

export interface Verifier {
    verify(task: Task, address: string): Promise<boolean | number>
}
