import { defineComponent, PropType, provide } from 'vue';
import { Schema } from './types';
import SchemaItem from './SchemaItem';
import { SchemaFormContextKey } from './context';

export default defineComponent({
  name: 'SchemaForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  setup(props, { slots, emit, attrs }) {
    // 这里还可以进行一些中转的处理操作
    const handleChange = (v: any) => {
      props.onChange(v);
    };

    // 解决循环引用问题，如果直接是object形式，不是一个响应式的，这里的变化不会被更新到inject的地方
    // const context: any = reactive({
    //   SchemaItem,
    // });
    // 不过我们这里SchemaItem是一个固定的组件，不会进行动态变化，直接使用普通对象就可以了
    const context: any = {
      SchemaItem,
    };
    // 直接这样使用不好维护，万一父节点更改，会影响所有使用的地方。而且后面别的地方又provide了vjsf会被覆盖
    // provide('vjsf', context);
    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value } = props;
      return (
        <SchemaItem
          schema={schema}
          value={value}
          rootSchema={schema}
          onChange={handleChange}
        />
      );
    };
  },
});
