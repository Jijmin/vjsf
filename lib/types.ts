import { PropType } from 'vue';

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

// SchemaItem 中的props其实会向下传递到各个组件，会出现重复定义，这里提取出来
export const FieldPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    // eslint-disable-next-line
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const;
