/**
 *
 */
import axios, { AxiosInstance } from "axios";
import { detect as detectPlatform } from "detect-browser";
import qs from "qs";
import querystring from "querystring";
import {
  AuthCredentials,
  CheckIfAuthorizedResponse,
  GenericAPIErrorRersponse,
  HttpRequestConfig,
  MessengerPeopleClient,
  OAuthClientCredentials,
  OAuthTokenResponse,
} from ".";

const MESSENGERPEOPLE_BASE_URL = "https://api.messengerpeople.dev";
const MESSENGERPEOPLE_AUTH_URL = "https://auth.messengerpeople.dev";

interface RawDeserialized {
  [key: string]: RawDeserializedValue;
}

type RawDeserializedValue =
  | null
  | string
  | number
  | boolean
  | RawDeserialized
  | RawDeserializedValue[];

interface DeserializedWithDate {
  [key: string]: DeserializedWithDateValue;
}

type DeserializedWithDateValue =
  | null
  | string
  | number
  | boolean
  | Date
  | DeserializedWithDate
  | DeserializedWithDateValue[];

const parseRawDeserializedValue = (
  value: RawDeserializedValue
): DeserializedWithDateValue => {
  return value === null
    ? null
    : value instanceof Array
    ? value.map(parseRawDeserializedValue)
    : typeof value === "object"
    ? parseDatesInObject(value)
    : typeof value === "string"
    ? parseIfDate(value)
    : value;
};

const parseDatesInObject = (data: RawDeserialized): DeserializedWithDate => {
  const newData: DeserializedWithDate = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    newData[key] = parseRawDeserializedValue(value);
  });
  return newData;
};

const parseIfDate = (maybeDate: string): Date | string => {
  const regexISO =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(?:Z|([+-])([\d|:]*))?$/;
  if (maybeDate.match(regexISO)) {
    return new Date(maybeDate);
  }
  return maybeDate;
};

export const messengerpeopleClient = async (
  credentials: AuthCredentials
): Promise<MessengerPeopleClient> => {
  const authorizationHeader = await getAuthHeader(credentials).then((r) => r);

  const client = axios.create({
    baseURL: MESSENGERPEOPLE_BASE_URL,
    headers: {
      Authorization: authorizationHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Client": JSON.stringify(platformInfo),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });

  client.interceptors.response.use((response) => {
    response.data = parseRawDeserializedValue(response.data);
    return response;
  });
  return {
    delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
      return client.delete<T>(url, config).then((response) => response.data);
    },

    get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
      return client.get<T>(url, config).then((response) => response.data);
    },

    patch<T>(
      url: string,
      data?: unknown,
      config?: HttpRequestConfig
    ): Promise<T> {
      return client
        .patch<T>(url, data, config)
        .then((response) => response.data);
    },

    post<T>(
      url: string,
      data?: unknown,
      config?: HttpRequestConfig
    ): Promise<T> {
      return client
        .post<T>(url, data, config)
        .then((response) => response.data);
    },

    put<T>(
      url: string,
      data?: unknown,
      config?: HttpRequestConfig
    ): Promise<T> {
      return client.put<T>(url, data, config).then((response) => response.data);
    },
    checkIfAuthorized(): Promise<boolean> {
      return client
        .get<CheckIfAuthorizedResponse>("/")
        .then((response) => {
          if (response?.data?.status == "ok") return true;
          return false;
        })
        .catch((error) => false);
    },
  };
};

const platformInfo = detectPlatform();

/**
 * authorize against MESSENGERPEOPLE_AUTH_URL
 * @param credentials
 * @returns
 */
export const authorize = async (
  credentials: OAuthClientCredentials
): Promise<OAuthTokenResponse> => {
  return await axios
    .post(
      `${MESSENGERPEOPLE_AUTH_URL}/token`,
      querystring.stringify({
        grant_type: "client_credentials",
        client_id: credentials?.client_id,
        client_secret: credentials?.client_secret,
        scope: credentials?.scope.join(", ").replaceAll(",", ""),
      }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Client": JSON.stringify(platformInfo),
        },
      }
    )
    .then((result) => {
      const data: OAuthTokenResponse = result?.data;
      return data;
    })
    .catch((err) => {
      const error: GenericAPIErrorRersponse = err?.response?.data;
      throw new Error(`${error?.error} - status ${err.response?.status}`);
    });
};

const getAuthHeader = async (credentials: AuthCredentials): Promise<string> => {
  //if access_token parsed - we can return header directly
  if ("access_token" in credentials) return `Bearer ${credentials}`;
  //other request new access_token
  return authorize(credentials as OAuthClientCredentials).then(
    (obj) => `Bearer ${obj.access_token}`
  );
};
