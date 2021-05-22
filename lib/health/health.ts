import { MessengerPeopleClient, messengerpeopleClient } from "../";
import { HealthModule } from "./health.types";

export const createHealthModule = (
  client: MessengerPeopleClient
): HealthModule => ({
  getIPAdresses(): Promise<string[]> {
    return client.get("/ip");
  },
});
