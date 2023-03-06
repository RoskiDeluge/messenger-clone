"use client";

import { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import { Request } from "../typings";
import useSWR from "swr";
import fetcher from "../utils/fetchRequests";
import { useSession } from "next-auth/react";
// import { unstable_getServerSession } from "next-auth";

// type Props = {
//   session: Awaited<ReturnType<typeof unstable_getServerSession>>;
// };

// { session }: Props

function ChatInput() {
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const { data: session } = useSession();
  const { data: requests, error, mutate } = useSWR("api/getRequests", fetcher);

  // console.log("From the Redis db: ", requests)

  const addRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !session) return;

    const requestToSend = input;

    setInput("");

    const id = uuid();

    const request: Request = {
      id,
      request: requestToSend,
      created_at: Date.now(),
      username: session?.user?.name!,
      profilePic: session?.user?.image!,
      email: session?.user?.email!,
    };

    const uploadRequestToUpstash = async () => {
      const data = await fetch("/api/addRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request,
        }),
      }).then((res) => res.json());
      return [data.request, ...requests!];
    };
    // uploadRequestToUpstash();
    await mutate(uploadRequestToUpstash, {
      optimisticData: [request, ...requests!],
      rollbackOnError: true,
    });
  };

  const addPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const promptToSend = prompt.toString().trim();

    setPrompt("");

    /* create a function to send promptToSend to the /api/addPrompt endpoint, return a botresponse and push it to Upstash redis db */
    const id = uuid();

    const chatResponse = await fetch(
      "/api/addPrompt?prompt=" + encodeURIComponent(promptToSend)
    );
    const { botresponse } = await chatResponse.json();
    console.log(botresponse);
    setBotResponse(botresponse);

    const request: Request = {
      id,
      request: botResponse,
      created_at: Date.now(),
      // username: session?.user?.name!,
      username: "bot",
      // profilePic: session?.user?.image!,
      profilePic: "https://aleph42.s3.amazonaws.com/aleph-logo.png",
      // email: session?.user?.email!,
      email: "roberto@delgadodev.xyz",
    };

    const uploadRequestToUpstash = async () => {
      const data = await fetch("/api/addRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request,
        }),
      }).then((res) => res.json());
      return [data.request, ...requests!];
    };
    // uploadRequestToUpstash();
    await mutate(uploadRequestToUpstash, {
      optimisticData: [request, ...requests!],
      rollbackOnError: true,
    });
  };
  return (
    <>
      <form
        onSubmit={addRequest}
        className="fixed bottom-0 w-full flex mb-20 px-10 py-5 space-x-2 border-t bg-white border-gray-100"
      >
        <input
          type="text"
          value={input}
          disabled={!session}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your chat message here..."
          className="flex-1 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!input}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          chat
        </button>
      </form>
      <form
        onSubmit={addPrompt}
        className="fixed bottom-0 w-full flex px-10 py-5 space-x-2 border-t bg-white border-gray-100"
      >
        <input
          type="text"
          value={prompt}
          disabled={!session}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="flex-1 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!prompt}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          cbot
        </button>
      </form>
    </>
  );
}

export default ChatInput;
