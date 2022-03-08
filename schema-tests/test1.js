const Ajv = require('ajv');
/**
 * 每个子项都是string
 pets: {
    type: 'array',
    items: {
    type: 'string',
    },
 },
 */
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      validateName: 'false',
      //   validateName: true,
      //   format: 'email', // email的校验
      //   minLength: 10,
    },
    age: {
      type: 'number',
    },
    pets: {
      type: 'array',
      items: [
        {
          type: 'string',
          format: 'test', // 自定义format
        },
        {
          type: 'number',
        },
      ],
    },
    isWorker: {
      type: 'boolean',
    },
  },
  required: ['name', 'age'],
};

const ajv = new Ajv();
// 扩展一个自定义的format
ajv.addFormat('test', (data) => {
  console.log(data, '------------'); // haha ------------
  return data === 'haha';
});
// 扩展一个自定义关键字
ajv.addKeyword('validateName', {
  compile(sch, parentSchema) {
    console.log(sch, parentSchema); // false { type: 'string', validateName: 'false' }
    // return true; // error，需要返回一个函数 Cannot create property 'errors' on boolean 'true'
    return () => true;
  },
  metaSchema: {
    // 校验validateName关键字的类型
    type: 'string', // Error: keyword schema is invalid: data should be number
  },
  //   validate(schema, data) {
  //     // console.log(schema, data); // true Jokcy11111@qq.com
  //     if (schema === true) return true;
  //     else return schema.length === 5;
  //   },
});
const validate = ajv.compile(schema);
const valid = validate({
  name: 'Jokcy11111@qq.com',
  age: 18,
  pets: ['haha', 111],
  isWorker: true,
});
/**
 * const valid = validate('Jokcy11111'); // 没有结果输出
 * const valid = validate('Jokcy');
 [
  {
    keyword: 'minLength',
    dataPath: '',
    schemaPath: '#/minLength',
    params: { limit: 10 },
    message: 'should NOT be shorter than 10 characters'
  }
 ]
 */
if (!valid) console.log(validate.errors);
