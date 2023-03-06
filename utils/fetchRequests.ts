import { Request } from "../typings";

const fetcher = async () => {
    const res = await fetch("api/getRequests");
    const data = await res.json();
    const requests: Request[] = data.requests;

    return requests;
}

export default fetcher;