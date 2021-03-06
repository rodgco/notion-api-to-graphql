import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
  GraphQLScalarType,
  GraphQLInt
} from "graphql";

const pagination = {
  object: { type: new GraphQLNonNull(GraphQLString) },
  has_more: { type: new GraphQLNonNull(GraphQLBoolean) },
  next_cursor: { type: GraphQLString }
};

const NotionLinkObjectType = new GraphQLObjectType({
  name: "NotionLinkObject",
  fields: {
    type: { description: 'Always "url"', type: new GraphQLNonNull(GraphQLString) },
    url: { description: "Web address", type: new GraphQLNonNull(GraphQLString) }
  }
});

const NotionTextObjectType = new GraphQLObjectType({
  name: "NotionTextObject",
  fields: {
    content: { description: "Text content", type: new GraphQLNonNull(GraphQLString) },
    link: { description: "Any inline link in this text", type: NotionLinkObjectType }
  }
});

export interface NotionLinkObject {
  type: "url";
  url: string;
}

export interface NotionTextObject {
  content: string;
  link?: NotionLinkObject;
}

export interface NotionAnnotation {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color:
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "gray_background"
    | "brown_background"
    | "orange_background"
    | "yellow_background"
    | "green_background"
    | "blue_background"
    | "purple_background"
    | "pink_background"
    | "red_background";
}

export interface NotionPersonObject {
  email?: string;
}

export interface NotionUserObject {
  object: "user";
  id: string;
  type?: "person" | "bot";
  name?: string;
  avatar_url?: string;
  person?: NotionPersonObject;
  bot?: any;
}

export interface NotionDatePropertyValueObject {
  start: string;
  end?: string;
}

export interface NotionMentionObject {
  type: "user" | "page" | "database" | "date";
  user?: NotionUserObject;
  id?: string;
  date?: NotionDatePropertyValueObject;
}

export interface NotionEquationObject {
  expression: string;
}

export interface NotionRichText {
  plain_text: string;
  href?: string;
  annotations: NotionAnnotation;
  type: "text" | "mention" | "equation";
  text?: NotionTextObject;
  mention?: NotionMentionObject;
  equation?: NotionEquationObject;
}

export interface NotionDatabaseObject {
  object: "database";
  id: string;
  created_time: string;
  last_edited_time: string;
  title: NotionRichText[];
  properties: any;
  experimental_pages?: any;
}

interface pagination {
  object: "list";
  has_more: boolean;
  next_cursor?: string;
}

export interface NotionDatabasesList extends pagination {
  results: NotionDatabaseObject[];
}

export interface NotionParent {
  type: "database_id" | "page_id" | "worksapce";
  database_id?: string;
  page_id?: string;
}

export interface NotionPageObject {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: any;
  parent: NotionParent;
}

export interface NotionQueryDatabase extends pagination {
  results: NotionPageObject[];
}

const NotionAnnotationType = new GraphQLObjectType({
  name: "NotionAnnotation",
  fields: () => ({
    bold: { description: "Whether the text is bolded", type: new GraphQLNonNull(GraphQLBoolean) },
    italic: { description: "Whether the text is italicized", type: new GraphQLNonNull(GraphQLBoolean) },
    strikethrough: { description: "Whether the text is struck through", type: new GraphQLNonNull(GraphQLBoolean) },
    underline: { description: "Whether the text is underlined", type: new GraphQLNonNull(GraphQLBoolean) },
    code: { description: "Whether the text is code style", type: new GraphQLNonNull(GraphQLBoolean) },
    color: {
      description: "Color of the text",
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: "ColorEnum",
          values: {
            default: {},
            gray: {},
            brown: {},
            orange: {},
            yellow: {},
            green: {},
            blue: {},
            purple: {},
            pink: {},
            red: {},
            gray_background: {},
            brown_background: {},
            orange_background: {},
            yellow_background: {},
            green_background: {},
            blue_background: {},
            purple_background: {},
            pink_background: {},
            red_background: {}
          }
        })
      )
    }
  })
});

const NotionPersonObjectType = new GraphQLObjectType({
  name: "NotionPerson",
  fields: {
    email: { description: "Email address of person", type: GraphQLString }
  }
});

const NotionUserObjectType = new GraphQLObjectType({
  name: "NotionUserObject",
  fields: () => ({
    object: { description: 'Always "user"', type: new GraphQLNonNull(GraphQLString) },
    id: { description: "Unique identifier for this user", type: new GraphQLNonNull(GraphQLString) },
    type: {
      description: "Type of the user",
      type: new GraphQLEnumType({
        name: "NotionUserTypeEnum",
        values: {
          person: {},
          bot: {}
        }
      })
    },
    name: { description: "User's name, as displayed in Notion", type: GraphQLString },
    avatar_url: { description: "Chosen avatar image", type: GraphQLString },
    person: {
      description: "Properties only present for non-bot users",
      type: NotionPersonObjectType
    },
    bot: {
      description: "Properties only present for bot users",
      type: new GraphQLScalarType({
        name: "NotionBotObject",
        serialize(value) {
          return value;
        }
      })
    }
  })
});

const NotionDatePropertyValueObjectType = new GraphQLObjectType({
  name: "NotionDatePropertyValueObject",
  fields: {
    start: { description: "An ISO 8601 format date, with optional time", type: new GraphQLNonNull(GraphQLString) },
    end: { description: "An ISO 8601 format date, with optional time", type: GraphQLString }
  }
});

const NotionMentionObjectType = new GraphQLObjectType({
  name: "NotionMentionObject",
  fields: () => ({
    type: {
      description: "Type of the inline mention",
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: "MentionTypeEnum",
          values: {
            user: {},
            page: {},
            database: {},
            date: {}
          }
        })
      )
    },
    user: { type: NotionUserObjectType },
    id: { type: GraphQLString },
    date: { type: NotionDatePropertyValueObjectType }
  })
});

const NotionEquationObjectType = new GraphQLObjectType({
  name: "NotionEquationObject",
  fields: {
    expression: {
      description: "The LaTeX string representing this inline equation",
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

const NotionRichTextType = new GraphQLObjectType({
  name: "NotionRichText",
  fields: () => ({
    plain_text: { description: "The plain text without annotations", type: new GraphQLNonNull(GraphQLString) },
    href: { description: "The URL of any link or internal Notion mention in this text, if any", type: GraphQLString },
    annotations: {
      description: "All annotations that apply to this rich text",
      type: new GraphQLNonNull(NotionAnnotationType)
    },
    type: {
      description: "Type of this rich text object",
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: "RichTextTypeEnum",
          values: {
            text: {},
            mention: {},
            equation: {}
          }
        })
      )
    },
    text: { description: "Text content", type: NotionTextObjectType },
    mention: { description: "Mention", type: NotionMentionObjectType },
    equation: { description: "Equation", type: NotionEquationObjectType }
  })
});

const NotionProperties = new GraphQLScalarType({
  name: "NotionProperties",
  serialize(value) {
    return value;
  }
});

const NotionDatabaseObjectType = new GraphQLObjectType({
  name: "NotionDatabase",
  fields: () => ({
    object: { description: 'Always "database"', type: new GraphQLNonNull(GraphQLString) },
    id: { description: "Unique identifier of the database", type: new GraphQLNonNull(GraphQLString) },
    created_time: { description: "Date and time when this page was created", type: new GraphQLNonNull(GraphQLString) },
    last_edited_time: {
      description: "Date and time when this page was updated",
      type: new GraphQLNonNull(GraphQLString)
    },
    title: { description: "Title", type: new GraphQLNonNull(new GraphQLList(NotionRichTextType)) },
    properties: { description: "Database Properties", type: NotionProperties }
    // TODO: Implement "underlying" structures like pages
  })
});

const NotionDatabasesListType = new GraphQLObjectType({
  name: "NotionDatabasesList",
  fields: {
    ...pagination,
    results: { type: new GraphQLList(NotionDatabaseObjectType) }
  }
});

const NotionParentType = new GraphQLObjectType({
  name: "NotionParent",
  fields: {
    type: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: "ParentTypeEnum",
          values: {
            database_id: {},
            page_id: {},
            workspace: {}
          }
        })
      )
    },
    database_id: { description: "The ID of the database that this page belongs to", type: GraphQLString },
    page_id: { description: "The ID of the page that this page belongs to", type: GraphQLString }
  }
});

const NotionPageObjectType = new GraphQLObjectType({
  name: "NotionPageObject",
  fields: () => ({
    object: { description: 'Always "page"', type: new GraphQLNonNull(GraphQLString) },
    id: { description: "Unique identifier of the page", type: new GraphQLNonNull(GraphQLString) },
    created_time: { description: "Date and time when this page was created", type: new GraphQLNonNull(GraphQLString) },
    last_edited_time: {
      description: "Date and time when this page was updated",
      type: new GraphQLNonNull(GraphQLString)
    },
    archived: { description: "The archived status of the page", type: new GraphQLNonNull(GraphQLBoolean) },
    properties: { description: "Property values of this page", type: NotionProperties },
    parent: { type: new GraphQLNonNull(NotionParentType) }
  })
});

const NotionQueryDatabaseType = new GraphQLObjectType({
  name: "NotionQueryDatabase",
  fields: {
    ...pagination,
    results: { type: new GraphQLList(NotionPageObjectType) }
  }
});

interface ResolverArgs {
  id?: string;
  start_cursor?: string;
  page_size?: number;
  filter?: string;
  sort?: string;
}

interface ResolverContext {
  authorization: string;
}

export default function (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {
  const createSchema = async () => {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        description: "The main entrypoint to Notion API GraphQL",
        fields: {
          listDatabases,
          getDatabase,
          queryDatabase,
          getPage
        }
      })
    });
  };

  const getDatabase = {
    type: NotionDatabaseObjectType,
    args: {
      id: { description: "Database id", type: GraphQLString }
    },
    description: "Get a list of Notion databases",
    resolve: async function (_: any, { id }: ResolverArgs, { authorization }: ResolverContext) {
      const url = `https://api.notion.com/v1/databases/${id}`;

      const headers: HeadersInit = {
        authorization,
        "Content-Type": "application/json",
        "Notion-Version": "2021-05-13"
      };

      const response = await fetch(url, {
        headers,
        method: "GET"
      });

      if (response.ok) {
        const result = await response.json();

        return result;
      }

      throw response.statusText;
    }
  };

  const listDatabases = {
    type: NotionDatabasesListType,
    args: {
      start_cursor: { type: GraphQLString },
      page_size: { type: GraphQLInt }
    },
    description: "Get a list of Notion databases",
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    resolve: async function (_: any, { start_cursor, page_size }: ResolverArgs, { authorization }: ResolverContext) {
      const queryParams = [
        start_cursor ? `start_cursor=${start_cursor}` : undefined,
        page_size ? `page_size=${page_size}` : undefined
      ]
        .filter(Boolean)
        .join("&");

      const url = `https://api.notion.com/v1/databases${queryParams ? "?" : ""}${queryParams}`;

      const headers: HeadersInit = {
        authorization,
        "Content-Type": "application/json",
        "Notion-Version": "2021-05-13"
      };

      const response = await fetch(url, {
        headers,
        method: "GET"
      });

      if (response.ok) {
        const result = await response.json();

        return result;
      }

      throw response.statusText;
    }
  };

  const queryDatabase = {
    type: NotionQueryDatabaseType,
    args: {
      id: { description: "Identifier for a Notion database", type: GraphQLString },
      start_cursor: { type: GraphQLString },
      page_size: { type: GraphQLInt },
      filter: { type: GraphQLString },
      sort: { type: GraphQLString }
    },
    description:
      "Gets a list of Pages contained in the database, filtered and ordered according to the filter conditions and sort criteria provided in the request",
    resolve: async function (
      _: any,
      { id, start_cursor, page_size, filter, sort }: ResolverArgs,
      { authorization }: ResolverContext
    ) {
      const url = `https://api.notion.com/v1/databases/${id}/query`;

      const headers: HeadersInit = {
        authorization,
        "Content-Type": "application/json",
        "Notion-Version": "2021-05-13"
      };

      const body: BodyInit = JSON.stringify({
        start_cursor,
        page_size,
        filter,
        sort
      });

      const response: Response = await fetch(url, {
        headers,
        body,
        method: "POST"
      });

      if (response.ok) {
        const result = await response.json();

        return result;
      }

      throw response.statusText;
    }
  };

  const getPage = {
    type: NotionPageObjectType,
    args: {
      id: { description: "Identifier for a Notion page", type: GraphQLString }
    },
    description: "Retrieves a Page object using the ID specified",
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    resolve: async function (_: any, { id }: ResolverArgs, { authorization }: ResolverContext) {
      const url = `https://api.notion.com/v1/pages/${id}`;

      const headers: HeadersInit = {
        authorization,
        "Content-Type": "application/json",
        "Notion-Version": "2021-05-13"
      };

      const response = await fetch(url, {
        headers,
        method: "GET"
      });

      if (response.ok) {
        const result = await response.json();

        return result;
      }

      throw response.statusText;
    }
  };

  const defaultQuery = `query {
    listDatabases {
      id
      title {
        plain_text
      }
    }
  }`;

  return {
    createSchema,
    defaultQuery
  };
}
