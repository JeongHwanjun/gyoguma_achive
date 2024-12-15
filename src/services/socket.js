import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws-stomp';
const subscriptions = new Map();

const activeClients = new Map(); // Track active clients per roomId

export const connect = (roomId, onMessageReceived) => {
  if (activeClients.has(roomId)) {
    console.log(`WebSocket for room ${roomId} is already active. Ignoring activation request.`);
    return activeClients.get(roomId);
  }

  const client = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    debug: (str) => {
      console.log(str);
    },
  });

  client.onConnect = () => {
    if (!subscriptions.has(roomId)) {
      console.log('WebSocket connected!');
      const subscription = client.subscribe(`/sub/chat/room/${roomId}`, onMessageReceived);
      subscriptions.set(roomId, subscription);
    }
  };

  client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  client.activate();
  return client;
};

export const disconnect = (roomId) => {
  if (activeClients.has(roomId)) {
    const { client, subscription } = activeClients.get(roomId);
    subscription.unsubscribe();
    client.deactivate();
    activeClients.delete(roomId);
  }
};

export const enterChatRoom = (client, chatDTO) => {
  if (client && client.connected) {
    client.publish({
      destination: '/pub/chat/enterUser',
      body: JSON.stringify(chatDTO),
    });
  } else {
    console.error('WebSocket is not connected.');
  }
};

export const sendMessage = (client, message) => {
  if (client && client.connected) {
    client.publish({
      destination: '/pub/chat/sendMessage',
      body: JSON.stringify(message),
    });
  }
};

export const leaveChatRoom = (client, message) => {
  if (client && client.connected) {
    client.publish({
      destination: '/pub/chat/leaveUser',
      body: JSON.stringify(message),
    });
  }
};
