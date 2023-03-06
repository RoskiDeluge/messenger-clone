"use client";
import useSWR from "swr";
import fetcher from "../utils/fetchRequests";
import { Request } from "../typings";
import RequestComponent from "./RequestComponent";
import { useEffect } from "react";
import { clientPusher } from "../pusher";

type Props = {
  initialRequests: Request[];
};

function RequestList({ initialRequests }: Props) {
  const {
    data: requests,
    error,
    mutate,
  } = useSWR<Request[]>("api/getRequests", fetcher);

  useEffect(() => {
    const channel = clientPusher.subscribe("requests");

    channel.bind("new-request", async (data: Request) => {
      // If you sent the message, no need to to update cache
      if (requests?.find((request) => request.id === data.id)) return;

      if (!requests) {
        mutate(fetcher);
      } else {
        mutate(fetcher, {
          optimisticData: [data, ...requests!],
          rollbackOnError: true,
        });
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [requests, mutate, clientPusher]);

  return (
    <div className="space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto">
      {(requests || initialRequests).map((request) => (
        <RequestComponent key={request.id} request={request} />
      ))}
    </div>
  );
}

export default RequestList;
