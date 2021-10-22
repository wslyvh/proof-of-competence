export interface Space {
    name: string
    description: string
    website?: string
    twitter?: string
    tasks: Array<Task>
}

export interface Task {
    name: string
    description: string
    points: number
    chainId?: number
    verifier: string
}
