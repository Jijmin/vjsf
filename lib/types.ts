export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string };

// type Schema = any
export interface Schema {
  type: SchemaTypes | string;
  // eslint-disable-next-line
  const?: any;
  format?: string;
  // eslint-disable-next-line
  default?: any;
  properties?: {
    [key: string]: Schema | { $ref: string };
  };
  items?: Schema | Schema[] | SchemaRef;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  // vjsf?: VueJsonSchemaConfig
  required?: string[];
  // eslint-disable-next-line
  enum?: any[];
  // eslint-disable-next-line
  enumKeyValue?: any[];
  // eslint-disable-next-line
  additionalProperties?: any;
  additionalItems?: Schema;
}
