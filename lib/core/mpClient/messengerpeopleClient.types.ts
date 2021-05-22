import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export type AuthCredentials = OAuthClientCredentials | OAuthCredentials;

export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse<T> = AxiosResponse<T>;

export type HttpError<T> = AxiosError<T>;

/**
 * The client credentials grant
 * @description https://oauth.net/2/grant-types/client-credentials/
 */
export interface OAuthClientCredentials {
  client_id: string;
  client_secret: string;
  scope: string[];
}

/**
 * messengerpeople scopes - required for oauth process.
 * @description You can find a list with all scopes in the docu online.
 * @docu https://api.messengerpeople.dev/docs/authentication
 */
export enum SCOPES {
  /** Access billing - crm:billing */
  CRM_BILLING = "crm:billing",
  /** Create media objects / upload media files - media:create*/
  MEDIA_CREATE = "media:create",
  /** Delete media files - media:delete */
  MEDIA_DELETE = "media:delete",
  /** Access to uploaded media files - media:read */
  MEDIA_READ = "media:read",
  /** Send outgoing messages to users - messages:send */
  MESSAGES_SEND = "messages:send",
  /** Read messages - messages:read */
  MESSAGES_READ = "messages:read",
  /** Delete messages -  messages:delete */
  MESSAGES_DELETE = "messages:delete",
  /** Manage Messenger Settings (e.g. profile image) - messenger:settings */
  MESSENGER_SETTINGS = "messenger:settings",
  /** Create new event subscriptions - subscriptions:create */
  SUBSCRIPTIONS_CREATE = "subscriptions:create",
  /** Delete event subscriptions- subscriptions:delete */
  SUBSCRIPTIONS_DELETE = "subscriptions:delete",
  /** Read event subscriptions- subscriptions:read */
  SUBSCRIPTIONS_READ = "subscriptions:read",
  /** Update event subscriptions- subscriptions:update */
  SUBSCRIPTIONS_UPDATE = "subscriptions:update",
  /** Add new templates - templates:create */
  TEMPLATES_CREATE = "templates:create",
  /** Delete templates - templates:delete */
  TEMPLATES_DELETE = "templates:delete",
  /**  Read message templates - templates:read */
  TEMPLATES_READ = "templates:read",
  /**  Update message templates - templates:update */
  TEMPLATES_UPDATE = "templates:update",
  /**  Access the user profile - user:profile */
  USER_PROFILE = "user:profile",
  /**  Access the users public profile - user:profile:public */
  USER_PROFILE_PUBLIC = "user:profile:public",
  /**  Access the users scopes - user:scopes */
  USER_SCOPES = "user:scopes",
  /**  Create webhooks- webhooks:create */
  WEBHOOK_CREATE = "webhooks:create",
  /**  Delete webhooks- webhooks:delete */
  WEBHOOK_DELETE = "webhooks:delete",
  /**  Read webhooks- webhooks:delete */
  WEBHOOK_READ = "webhooks:read",
  /**  Update webhooks- webhooks:update */
  WEBHOOK_UPDATE = "webhooks:update",
  /**  Admin access to the Slingshot CRM - also a scope bundle, required for the Frontend. - crm:admin
   * @deprecated  Do not use it in your token requests, since we plan on removing this scope.
   */
  CRM_ADMIN = "crm:admin",
}
/** If you already have a valid access_token, you can use it directly.
 * @description Attention - the access_token has a limited lifetime (10 Years). You must renew the access_token yourself.
 */
export interface OAuthCredentials {
  access_token: string;
}
/**
 * @type interface
 *
 */
export interface OAuthTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
}

export interface GenericAPIErrorRersponse {
  error: string;
  errors: GenericAPIErrorRersponse[];
  hint?: string;
  correlation_id?: string;
  status_code: number;
}

export interface CheckIfAuthorizedResponse {
  status: string;
}

export interface MessengerPeopleClient {
  get: <T>(url: string, config?: HttpRequestConfig) => Promise<T>;
  post: <T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ) => Promise<T>;
  put: <T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ) => Promise<T>;
  delete: <T>(url: string, config?: HttpRequestConfig) => Promise<T>;
  patch: <T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ) => Promise<T>;
  checkIfAuthorized: () => Promise<boolean>;
}
