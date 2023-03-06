// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({body: "Prompt missing"})
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
        {"role": "system", "content": "You are a command line translation tool for MacOS."},
        {"role": "user", "content": `Give me the cli command that answers the following question: ${prompt}"`}
    ]
  })

  const botresponse =  completion.data.choices[0].message?.content;

  res.status(200).json({botresponse})
}
