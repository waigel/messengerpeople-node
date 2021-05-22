import { MessengerPeopleClient, messengerpeopleClient } from "../";
import {
  AllMessagePayload,
  Conversation,
  ConversationsParameter,
  Message,
  MessageSendResponse,
  MessagesFilterParameter,
  MessagesModule,
  TemplateMessagePayload,
} from ".";

export const createMessagesModule = (
  client: MessengerPeopleClient
): MessagesModule => ({
  send(
    channelId: string,
    recipient: string,
    payload: AllMessagePayload
  ): Promise<MessageSendResponse> {
    return client.post("/messages", {
      identifier: `${channelId}:${recipient}`,
      payload,
    });
  },
  getAll(params?: MessagesFilterParameter): Promise<Message[]> {
    return client.get("/messages", { params });
  },
  get(uuid?: string): Promise<Message> {
    return client.get(`/messages/${uuid}`);
  },
  delete(uuid?: string): Promise<Message> {
    return client.delete(`/messages/${uuid}`);
  },
  getConversations(params?: ConversationsParameter): Promise<Conversation[]> {
    return client.get(`/messages/conversations`, { params });
  },
});
