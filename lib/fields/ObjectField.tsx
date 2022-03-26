import { FieldPropsDefine } from '../types';
import { defineComponent } from 'vue';
import SchemaItem from '../SchemaItem';
console.log(SchemaItem); // 会造成循环引用

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
};

export default defineComponent({
  name: 'ObjectField',
  props: FieldPropsDefine,
  setup() {
    return () => {
      return <div>Object Field</div>;
    };
  },
});
