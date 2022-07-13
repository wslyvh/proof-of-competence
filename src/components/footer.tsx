import { Center, Link, useColorModeValue } from '@chakra-ui/react'

export default function Footer() {

    return (
    <Center as="footer" bg={useColorModeValue('gray.300', 'gray.700')} p={6}>

        Based on <Link href="https://github.com/wslyvh/proof-of-competence" isExternal>Proof-of-Competence</Link>.
        
    </Center>)
}
