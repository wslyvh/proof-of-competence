# Proof of Competence

Proof of Competence (PoC) is an open, permissionless framework to create on-boarding journeys into the Web3 space. It uses a pluggable task system which can verify that on-chain actions have occurred. This allows to build up reputation or social (DAO) scores that proof an address is familiar with the specified technologies or protocols.

This allows to:
* Create on-boarding journeys for developers to learn about a protocol
* Proof an address is competent enough to have a basic understanding of a protocol
* Novel ways to use the social (DAO) scores instead of token-weights for governance

# Journey's

Create a journey and define the tasks that are important for your project to help people become more familiar with the protocol. 

## Adding a journey

* A journey should be unique and be used to onboard new people into the space
* Journeys are stored in JSON format at `/src/journeys`. 

A journey is defined in the following format
```
{
    "name": "Title of the journey.",
    "description": "A clear and concise description of the journey.",
    "website": "https://website.org/",
    "twitter": "AccountHandle",
    "tasks": []
}
```

## Adding a task verifier
 
* A task should be unique
* A task requires a `verifier` in the `/src/verifiers`
* A task should verify information that is publicly available and can be verified by anyone (e.g. on-chain, Subgraphs, or public blockchain explorers) 
* You can specify an amount of points for completing a task
* The verifier returns either a `boolean` or a `number` for each instance the task was completed (e.g. x amount of transactions)

A tasks is defined in the following format
```
{
    "name": "Deploy",
    "description": "Deploy any kind of contract to mainnet.",
    "points": 100,
    "verifier": "deployed-contract",
    "chainId": 1
}
```

* chainId is optional and defaults to 1 (mainnet)

# PoC API 

The Proof of Competence scores can be integrated into other projects by using the API. There are 2 main endpoints to fetch the journey, as described above, or include the scores from a specific address.

## Endpoints

* Journey - `https://proof-of-competence.vercel.app/api/journey?name=useweb3` 
* Score - `https://proof-of-competence.vercel.app/api/journey/score?journey=useweb3&address=0x123`

### License
[MIT](LICENSE)