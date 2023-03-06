import { Request } from "../typings";
import Image from "next/image";
import { useSession } from "next-auth/react";
import TimeAgo from "react-timeago";

type Props = {
  request: Request;
};

function RequestComponent({ request }: Props) {
  // const isUser = false;
  const { data: session } = useSession();
  const isUser = session?.user?.email === request.email;

  return (
    <div className={`flex w-fit ${isUser && "ml-auto"}`}>
      <div className={`flex-shrink-0 ${isUser && "order-2"}`}>
        <Image
          className="rounded-xl mx-2"
          height={50}
          width={50}
          src={
            isUser
              ? request.profilePic
              : "https://aleph42.s3.amazonaws.com/aleph-logo.png"
          }
          alt="Profile Picture"
        />
      </div>
      <div>
        <p
          className={`text-[0.65rem] px-[2px] pb-[2px] ${
            isUser ? "text-blue-400 text-right" : "text-red-400 text-left"
          }`}
        >
          {request.username}
        </p>
        <div className="flex items-end">
          <div
            className={`px-3 py-2 rounded-lg w-fit ${
              isUser
                ? "bg-blue-400  text-white ml-auto order-2"
                : "bg-gray-200 text-black font-mono"
            }`}
          >
            <p>{request.request}</p>
          </div>
          <p
            className={`text-[0.65rem] italic px-2 text-gray-300 ${
              isUser && "text-right"
            }`}
          >
            <TimeAgo date={new Date(request.created_at)} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestComponent;
