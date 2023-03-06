// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../redis'
import { Request } from '../../typings'

type Data = {
  requests: Request[];
}

type ErrorData = {
    body: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
    if (req.method !== 'GET') {
        res.status(405).json({body: 'Method not allowed'})
        return
    }

    const requestsRes = await redis.hvals('requests')
    const requests: Request[] = requestsRes.map((request) => JSON.parse(request)).sort((a, b) => b.created_at - a.created_at)

  res.status(200).json({ requests })
}
