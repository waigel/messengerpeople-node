export interface MessagesModule {
  /**
   * Sends a message
   * @docu https://api.messengerpeople.dev/docs/resource/messages#endpoint-send
   * @scopes messages:send
   * @error none
   * @param channelId
   * @param recipient
   * @returns MessageSendResponse
   */
  send: (
    channelId: string,
    recipient: string,
    payload: AllMessagePayload
  ) => Promise<MessageSendResponse>;
  /**
   * Retrieves all messages, newest messages first
   * default: limited to 500 messages with offset 0
   * @docu https://api.messengerpeople.dev/docs/resource/messages#endpoint-index
   * @scopes messages:read
   * @error none
   * @param MessagesFilterParameter
   * @returns Message[]
   */
  getAll: (params?: MessagesFilterParameter) => Promise<Message[]>;
  /**
   * Retrieves a single message.
   * @docu https://api.messengerpeople.dev/docs/resource/messages#endpoint-single
   * @scopes messages:read
   * @error none
   * @param uuid
   * @returns Message
   */
  get: (uuid?: string) => Promise<Message>;
  /**
   * Delete a single message (Remove all its content, but keep the line in the database for statistics and invoicing).
   * This does not remove the message from your recipients phone / app.
   * @docu https://api.messengerpeople.dev/docs/resource/messages#endpoint-delete
   * @scopes messages:delete
   * @error none
   * @param uuid
   * @returns Message
   */
  delete: (uuid?: string) => Promise<Message>;
  /**
   * Beta Returns conversations for one or more channels.
   * Conversations are chats, ordered in a way you’d expect them in a web chat interface.
   * Only returns successful (outgoing) chats!
   * @docu https://api.messengerpeople.dev/docs/resource/messages#endpoint-get-conversations
   * @scopes messages:read
   * @error none
   * @param ConversationsParameter
   * @returns Conversation[]
   */
  getConversations: (
    params?: ConversationsParameter
  ) => Promise<Conversation[]>;
}

/**
 * MessagePayload
 */

export type AllMessagePayload =
  | TextMessagePayload
  | AttachmentsMessagePayload
  | CurrencyMessagePayload
  | DateTimeMessagePayload
  | ContactsMessagePayload
  | LocationMessagePayload
  | TemplateMessagePayload;
export type MessagePayload = TextMessagePayload;

export interface TextMessagePayload {
  type: "text";
  text: string;
}
export interface AttachmentsMessagePayload {
  type: "image" | "audio" | "video";
  text?: string;
  attachment: string;
}
export interface CurrencyMessagePayload {
  type: "currency";
  currency: {
    /** Country code of currency
     * @example USD */
    code: string;
    /**Currency with symbole - title as string*/
    fallback_value: string;
    /** Amount - number */
    amount_1000: number;
  };
}
export interface DateTimeMessagePayload {
  type: "date_time";
  date_time: {
    fallback_value: string;
    day_of_week: number | 5;
    day_of_month: number;
    year: number;
    month: number;
    hour: number;
    minute: number;
  };
}
/**
 *
 */

type LocationType = "HOME" | "WORK";

export interface ContactsMessagePayload {
  type: "contact";
  contacts: [
    {
      /**
       * The addresses Object
       * @docu https://developers.facebook.com/docs/whatsapp/api/messages#addresses-object
       */
      addresses?: [
        {
          /** Street number and name */
          street?: string;
          /**  City name. */
          city?: string;
          /** State abbreviation. */
          state?: string;
          /** ZIP code. */
          zip?: string;
          /** Full country name. */
          country?: string;
          /** Two-letter country abbreviation. */
          country_code?: string;
          /** Standard Values: HOME, WORK */
          type?: LocationType;
        }
      ];
      /**YYYY-MM-DD formatted string. */
      birthday?: string;
      /**
       * The emails Object
       * @docu https://developers.facebook.com/docs/whatsapp/api/messages#emails-object
       */
      emails?: [
        {
          /** Email address */
          email?: string;
          /** Standard Values: HOME, WORK */
          type?: LocationType;
        }
      ];
      /**
       * The name Object
       * @docu https://developers.facebook.com/docs/whatsapp/api/messages#name-object
       * @description  (*) At least one of the optional parameters needs to be included along with the formatted_name parameter.
       */
      name: {
        /**Full name, as it normally appears. */
        formatted_name: string;
        /** First name. (*) **/
        first_name?: string;
        /**Last name. (*) */
        last_name?: string;
        /**Middle name. (*) */
        middle_name?: string;
        /**Name suffix. (*) */
        suffix?: string;
        /**Name prefix. (*) */
        prefix?: string;
      };
      /**
       * The org Object
       * @docu https://developers.facebook.com/docs/whatsapp/api/messages#org-object
       */
      org?: {
        /**Name of the contact's company. */
        company?: string;
        /**Name of the contact's department. */
        department?: string;
        /**Contact's business title. */
        title?: string;
      };
      /**
       * The phone Object
       * @docu https://developers.facebook.com/docs/whatsapp/api/messages#phone-object
       */
      phones?: [
        {
          /**Automatically populated with the wa_id value as a formatted phone number. */
          phone?: string;
          /**Standard Values: CELL, MAIN, IPHONE, HOME, WORK */
          type?: "CELL" | "MAIN" | "IPHONE" | "HOME" | "WORK";
          /**WhatsApp ID. */
          wa_id?: string;
        }
      ];
      /**
       * The urls Object
       * @docu https://developers.facebook.com/docs/whatsapp/api/messages#urls-object
       */
      urls?: [
        {
          /**URL. */
          url?: string;
          /**Standard Values: HOME, WORK */
          type?: LocationType;
        }
      ];
    }
  ];
}

export interface LocationMessagePayload {
  type: "location";
  /**
   * The location Object
   * @docu https://developers.facebook.com/docs/whatsapp/api/messages#location-object
   */
  location: {
    /**Longitude of the location */
    longitude: number;
    /**Latitude of the location  -90 to 90. */
    latitude: number;
    /**Name of the location. */
    name?: string;
    /**Address of the location. Only displayed if name is present. */
    address?: string;
  };
}

/**
 * Please read the section: "https://api.messengerpeople.dev/docs/multimedia-templates" to understand this function.
 * Your termplate need a manuel review before you can use it.
 */
export interface TemplateMessagePayload {
  type: "template";
  /**
   * The template Object
   * @docu https://developers.facebook.com/docs/whatsapp/api/messages#template-object
   */
  template: {
    /**Type of template
     * @example notification
     */
    type: string;
    notification?: TemplateObject;
  };
}

export interface TemplateObject {
  /**ttl.
   * @deprecated The "ttl" field will be deprecated in v2.35.
   */
  ttl: number;
  /**Name of the template. Should be equal with your reviewd template. */
  name?: string;
  /**Language - Two-letter country abbreviation */
  language?: string;
  /**Array of parameters for your template */
  components?: TemplateComponents[];
}

export type TemplateComponents =
  | TemplateParameterComponent
  | TemplateParameterComponentButton;
/**
 * The components object
 * Inside components, you can nest the parameters object. Additionally, you can set type to button.
 * @docu https://developers.facebook.com/docs/whatsapp/api/messages#components-object
 */
export interface TemplateParameterComponent {
  type: "header" | "body" | "footer";
  parameters?: AllMessagePayload;
}

/**
 * The components object (button)
 * Inside components, you can nest the parameters object.
 * @docu https://developers.facebook.com/docs/whatsapp/api/messages#components-object
 */
export interface TemplateParameterComponentButton {
  type: "button";
  /**Used when type is set to button.
   * Supported values are:
   * quick_reply: Refers to a previously created quick reply button that allows for the customer to return a predefined message. See Callback from a Quick Reply Button Click for an example of a response from a quick reply button.
   * url: Refers to a previously created button that allows the customer to visit the URL generated by appending the text parameter to the predefined prefix URL in the template. */
  subtype: "quick_reply" | "url";
  /** Position index of the button. You can have up to 3 buttons using index values of*/
  index: 0 | 1 | 2;
  parameters: UrlButton | PayloadButton;
}
export interface UrlButton {
  /**Indicates the type of parameter for the button. Supported values are payload and text. */
  type: "text";
  /** Developer provided suffix that will be appended to a previously created dynamic URL button. */
  text: string;
  url: string;
}

export interface PayloadButton {
  /**Indicates the type of parameter for the button. Supported values are payload and text. */
  type: "payload";
  /** Developer-defined payload that will be returned when the button is clicked in addition to the display text on the button.*/
  payload: string;
}

export interface MessageSendResponse {
  id: string;
  messenger: string;
  message_amount: number;
  split: boolean;
  status: string;
}

export interface MessagesFilterParameter {
  /**Amount of messages */
  limit?: number | 500;
  /**Skip this amount of messages */
  offset?: number | 0;
  /**Fields to sort by. This allows multiple sorts as field:direction, so sorting by sender descending, then by recipient would be sender:desc,recipient:asc. */
  sort?: string;
  /**
   * Filters to apply. This allows complex filter expressions as field-operator-value and multiple filters joined by comma. Read the
   * filtering section for more information.
   * @docu https://api.messengerpeople.dev/docs/filtering
   */
  filter?: string;
  /**Search query to search for. Includes sender, recipient and messenger ID. */
  query?: string;
  /**
   * Only show messages with this recipient
   * @deprecated Use the filter parameter instead
   */
  recipient?: string;
  /**
   * Only show messages with this sender
   * @deprecated Use the filter parameter instead
   */
  sender?: string;
  /**
   * Only show outgoing (true) or incoming (false) messages or don’t submit this parameter or set it to “both” for both directions.
   * @deprecated Deprecated: Use the filter parameter instead
   */
  outgoing?: boolean;
}

export interface ConversationsParameter {
  /**UUID of the channel. Leave empty for all channels */
  channel?: string;
  /**ID, Phone number, identifier of the user. Leave empty for all users. Only works in combination with channel param */
  user?: string;
  /**Amount of conversations, default 100 */
  limit?: number | 100;
  /**Amount of chats within one conversation, default 100 */
  limitchats?: number | 100;
}

export interface Conversation {
  user: string;
  channel: string;
  last_chat: Date;
  chats: Message[];
}

export interface Message {
  uuid: string;
  sender: string;
  recipient: string;
  messenger: string;
  messenger_id: string;
  payload: any;
  outgoing: boolean;
  statuscode: number;
  webhook_request?: any;
  result: string;
  processed: Date;
  sent: Date;
  received: Date;
  read?: Date;
  created: Date;
}
