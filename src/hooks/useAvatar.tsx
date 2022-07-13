// import { useWeb3React } from "@web3-react/core"
import makeBlockie from "ethereum-blockies-base64"
import { useEffect, useState } from "react"

const defaultValue = {name: '', url: ''}

export function useAvatar(address:string | undefined) {
    // const web3 = useWeb3React()
    const [avatar, setAvatar] = useState(defaultValue)

    useEffect(() => {
        async function getAvatar() { 
            if (!address) {
                setAvatar(defaultValue)
                return
            }

            // const name = await web3.library?.lookupAddress(web3.account)
            // if (!name) {
                setAvatar({
                    name: '',
                    url: makeBlockie(address)
                })
                return
            // }
        
            // const resolver = await web3.library?.getResolver(name)
            // const ensAvatar = await resolver?.getAvatar()
            // setAvatar({
            //     name: name,
            //     url: ensAvatar?.url ?? makeBlockie(web3.account),
            // })
        }

        getAvatar()
    }, [address])

    return avatar
}
