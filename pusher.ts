import Pusher from "pusher";
import ClientPusher from "pusher-js";

export const serverPusher = new Pusher({
    //In prod refactor to env variables.
    appId: "1531134",
    key: "33452215aac64538f4e3",
    secret: "95162ab27a382f42c846",
    cluster: "mt1",
    useTLS: true
})


export const clientPusher = new ClientPusher('33452215aac64538f4e3', {
    cluster: 'mt1',
    forceTLS: true
  });