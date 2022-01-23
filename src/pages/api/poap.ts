import type { NextApiRequest, NextApiResponse } from 'next'

const at = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5qQTNOalpGUWpkRE9ESTNRa0V3UlVSRE9VVkVNRVUxT1VVd1JrSTNNRGs1TlRORVFqUTNSUSJ9.eyJpc3MiOiJodHRwczovL3BvYXBhdXRoLmF1dGgwLmNvbS8iLCJzdWIiOiJjMG1zcXJsZDdtSjBzNVNkMnB5TkhCU0w2Vmh4V29DdEBjbGllbnRzIiwiYXVkIjoicHJvb2Ytb2YtY29tcGV0ZW5jZSIsImlhdCI6MTY0MTU1OTcwMywiZXhwIjoxNjQxNjQ2MTAzLCJhenAiOiJjMG1zcXJsZDdtSjBzNVNkMnB5TkhCU0w2Vmh4V29DdCIsInNjb3BlIjoibWludCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIm1pbnQiXX0.Kpiba5n3_v4ZcPNvp5U992qzXelFRIAlGkHyRfxDQFDLwN2biXOOpMoj10HFqeJ3J_vvboB5iHqRwjZrlDsrrJIyTlqjo6blAlObQ6-P0XUZdGb9koSV35W3yr-WXLorcclrYn-y7HbogeOAh0wuU10SMxIr9TxRU63yoqeCn2hi3B8XDRyYNRV5YMwte-0Xelg6Br5_R49YbVxVITY4KySI8fXuAICQxaRkPGmcGwXXo_1UZ19zLPeioqvayg3QjSn90jKLoLp39IlKIUP5ult4WGIpVPh95bhl-JXa0gHB-2nkGz4dg76ieMfJpN9kVmrvIFxeZwQQy2NOyV5MIQ'
const eventId = 15420
const secretCode = 578120

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {

  // Request OAUTH Token
  // ===
  // const authResponse = await fetch('https://poapauth.auth0.com/oauth/token', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     audience: "proof-of-competence",
  //     grant_type: "client_credentials",
  //     client_id: "c0msqrld7mJ0s5Sd2pyNHBSL6VhxWoCt",
  //     client_secret: "NG4x62KLWXhTDjRE22NDu6Hk4SxM0LhNxqrERO3ZiIxiZwyLYZXDZH4cE_XjbwwR"
  //   })
  // })
  // const auth = await authResponse.json()
  // console.log('AUTH', auth)


  // Request more codes 
  // ===
  // const redeemResponse = await fetch('https://api.poap.tech/redeem-requests', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${at}`
  //   },
  //   body: JSON.stringify({
  //     event_id: eventId,
  //     requested_codes: 50,
  //     secret_code: secretCode,
  //     redeem_type: "qr_code"
  //   })
  // })
  // const redeem = await redeemResponse.json()
  // console.log('REDEEM REQUESTS', redeem)


  // Request Claim info
  // ===

  // http://POAP.xyz/claim/aw6ggl
  // const qr = 'aw6ggl'
  // const claimResponse = await fetch('https://api.poap.tech/actions/claim-qr?qr_hash=' + qr, {
  //   method: 'GET',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${at}`
  //   },
  // })

  // const claim = await claimResponse.json()
  // // console.log('CLAIM QR', claim)
  // console.log('CLAIM Secret', claim.secret)
  
  // Mint / Post Claim QR
  // ===
  // const mintResponse = await fetch('https://api.poap.tech/actions/claim-qr?qr_hash=' + qr, {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${at}`
  //   },
  //   body: JSON.stringify({
  //     address: '0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab',
  //     qr_hash: qr,
  //     secret: claim.secret,
  //   })
  // })
  // const mint = await mintResponse.json()
  // console.log('MINT', mint)


  // Get QR codes
  // ===
  const qrResponse = await fetch(`https://api.poap.tech/event/${eventId}/qr-codes`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${at}`
    },
    body: JSON.stringify({
      secret_code: secretCode,
    })
  })
  const qrs = await qrResponse.json() as any[]
  console.log('QR CODES', qrs.length, 'CLAIMED', qrs.filter(i => i.claimed).length)

  res.status(200).json('Ok')
}
