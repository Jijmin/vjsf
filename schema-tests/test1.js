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
      format: 'email',
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
          format: 'test',
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
  console.log(data, '------------');
  return data === 'haha';
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
