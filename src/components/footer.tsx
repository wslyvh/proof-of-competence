import { Center, Link, useColorModeValue } from '@chakra-ui/react'

export default function Footer() {

    return (
    <Center as="footer" bg={useColorModeValue('gray.200', 'gray.700')} p={6}>
        <p>    
        Based on PoC Framework ( <Link href="https://github.com/wslyvh/proof-of-competence" isExternal>Proof-of-Competence</Link> ).
        </p>
    </Center>)
}
