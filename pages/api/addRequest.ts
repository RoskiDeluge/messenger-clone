// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { serverPusher } from '../../pusher'
import redis from '../../redis'
import { Request } from '../../typings'

type Data = {
  request: Request
}

type ErrorData = {
    body: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
    if (req.method !== 'POST') {
        res.status(405).json({body: 'Method not allowed'})
        return
    }

    const {request} = req.body;

    const newRequest = {
        ...request,
        // Replace user time stamp with server time stamp
        created_at: Date.now()
    }
    // Push to upstash redis db
    await redis.hset('requests', request.id, JSON.stringify(newRequest))
    // serverPusher.trigger('requests', 'new-request', newRequest)

  res.status(200).json({ request: newRequest })
}
