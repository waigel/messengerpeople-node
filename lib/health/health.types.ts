export interface HealthModule {
  /**
   * Returns the IP addresses currently used to send webhooks to your servers.
   * @docu https://api.messengerpeople.dev/docs/resource/health#endpoint-ip-adresses
   * @scopes none
   * @error none
   * @param none
   * @returns string[]
   */
  getIPAdresses: () => Promise<string[]>;
}
