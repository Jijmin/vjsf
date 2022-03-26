import { defineComponent } from 'vue';
import NumberField from './fields/NumberField';
// import StringField from './fields/StringField';
import StringField from './fields/StringField.vue';
import { SchemaTypes, FieldPropsDefine } from './types';

// 根据不同类型将渲染对应的schema分发给对应的组件
export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  // eslint-disable-next-line
  setup(props) {
    return () => {
      // 根据type设置不同的component
      const { schema } = props;
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
        default: {
          console.warn(`${type} is not supported`);
        }
      }
      // 这里只是一个中转的一个组件，实际执行的还是底层的Component
      return <Component {...props} />;
    };
  },
});
