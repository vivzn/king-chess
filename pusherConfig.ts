import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
    appId: "1781690",
    key: "15619571febcdb15535c",
    secret: "f082646bd8a93b372a10",
    cluster: "ap1",
    useTLS: true,
})

export const pusherClient = new PusherClient("15619571febcdb15535c", {
    cluster: "ap1",
    authEndpoint: "/api/pusher-auth",
    authTransport: "ajax",
    auth: {
        headers: {
            'Content-Type': "application/json"
        }
    }
});

