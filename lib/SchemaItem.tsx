import { computed, defineComponent } from 'vue';
// import NumberField from './fields/NumberField';
// import StringField from './fields/StringField';
import ObjectField from './fields/ObjectField';
import NumberField from './fields/NumberField.vue';
import StringField from './fields/StringField.vue';
import { SchemaTypes, FieldPropsDefine } from './types';
import { retrieveSchema } from './utils';

// 根据不同类型将渲染对应的schema分发给对应的组件
export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  // eslint-disable-next-line
  setup(props) {
    // 变的时候才重新计算
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props;
      return retrieveSchema(schema, rootSchema, value);
    });
    return () => {
      // 根据type设置不同的component
      const { schema } = props;
      // 放在这个setup的return中，每次SchemaItem被重新渲染的时候，这里都会重新执行。这个函数会小型的便利schema，不建议在这里直接使用
      //   const retrievedSchema = retrieveSchema(schema, rootSchema, value);
      const retrievedSchema = retrievedSchemaRef.value;
      // TODO: 如果type没有指定，我们可以猜测这个type
      // schema.type并不是必须的
      const type = schema.type;
      // eslint-disable-next-line
      let Component: any;
      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField;
          break;
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField;
          break;
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField;
          break;
        }
        default: {
          console.warn(`${type} is not supported`);
        }
      }
      // 这里只是一个中转的一个组件，实际执行的还是底层的Component
      return <Component {...props} schema={retrievedSchema} />;
    };
  },
});
