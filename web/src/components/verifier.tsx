import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { Task } from 'types'
import { verifyScore } from 'utils/verify'

interface Props {
    task: Task
    address?: null | string
}

export default function Verifier(props: Props) {
    const [result, setResult] = useState<boolean | number | undefined>()
    const web3 = useWeb3React()

    useEffect(() => {
        async function verify() {
            const result = await verifyScore(props.task, web3.library, web3.account)

            setResult(result)
        }

        verify()
    }, [props])

    if (result === undefined) return null

    return (
        <div>
            <p>Result: {String(result)}</p>
        </div>
    )
}