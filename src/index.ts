import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { listDatabases, getDatabase, queryDatabase, pagination } from "./notion";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createSchema = async () => {
  // You can substitute this with any way you want to build your schema
  // (that's why this is in an async function -- for libraries like TypeGraphQL)
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      description: "The main entrypoint to our API",
      fields: {
        listDatabases,
        getDatabase,
        queryDatabase
      }
    })
  });
};

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

export const defaultQuery = `# Try out our API with a query like this:
query {
	double(number: 12)
}
`;
