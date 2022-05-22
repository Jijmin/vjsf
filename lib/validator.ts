import Ajv from 'ajv';
import toPath from 'lodash.topath';
import { Schema } from './types';
const i18n = require('ajv-i18n'); // eslint-disable-line

interface TransformErrorObject {
  name: string;
  property: string;
  message: string | undefined;
  params: Ajv.ErrorParameters;
  schemaPath: string;
}

interface ErrorSchemaObject {
  [level: string]: ErrorSchema;
}
export type ErrorSchema = ErrorSchemaObject & {
  __errors?: string[];
};

function toErrorSchema(errors: TransformErrorObject[]) {
  if (errors.length < 1) return {};
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = toPath(property); // 将/a/b/c形式变成数组的形式
    let parent = errorSchema;

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1);
    }

    // {
    //   obj: {
    //     a: {}
    //   }
    // }
    // /obj/a
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        (parent as any)[segment] = {};
      }
      parent = parent[segment];
    }

    // {
    //   obj: {
    //     a: {__errors: [message]}
    //   }
    // }
    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message || '');
    } else {
      if (message) {
        parent.__errors = [message];
      }
    }
    return errorSchema;
  }, {} as ErrorSchema);
}

// 错误信息的转换
/**
 * {"errors":[{"name":"type","property":"","message":"应当是 string 类型","params":{"type":"string"},"schemaPath":"#/type"}],"errorSchema":{"__errors":["应当是 string 类型"]},"valid":false}
 */
function transformErrors(
  errors: Ajv.ErrorObject[] | null | undefined,
): TransformErrorObject[] {
  if (errors === null || errors === undefined) return [];
  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    // 做一下格式的规范
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath,
    };
  });
}

export function validateFormData(
  validator: Ajv.Ajv,
  formData: any,
  schema: Schema,
  locale: string,
) {
  let validationError: any = null; // 记录错误信息
  try {
    // schema如果有问题，调用会报错，使用try
    validator.validate(schema, formData);
  } catch (err) {
    validationError = err;
  }

  // 转换语言
  i18n[locale](validator.errors);
  // 错误信息的转换
  let errors = transformErrors(validator.errors);
  if (validationError) {
    errors = [
      ...errors,
      { message: validationError.message } as TransformErrorObject,
    ];
  }

  const errorSchema = toErrorSchema(errors);

  return {
    errors,
    errorSchema,
    valid: errors.length === 0,
  };
}
