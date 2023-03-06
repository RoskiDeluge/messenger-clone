import ChatInput from "./ChatInput";
import RequestList from "./RequestList";
import { Request } from "../typings";
import { unstable_getServerSession } from "next-auth";
import { Providers } from "./providers";

async function HomePage() {
  const data = await fetch(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api/getRequests`
  ).then((res) => res.json());

  const requests: Request[] = data.requests;
  const session = await unstable_getServerSession();
  // session={session}

  return (
    <Providers session={session}>
      <main>
        <RequestList initialRequests={requests} />
        <ChatInput />
      </main>
    </Providers>
  );
}

export default HomePage;
