import { defineComponent, PropType } from 'vue';
import { Schema } from './types';
import SchemaItem from './SchemaItem';

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
      // eslint-disable-next-line
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  // eslint-disable-next-line
  setup(props, { slots, emit, attrs }) {
    // 这里还可以进行一些中转的处理操作
    // eslint-disable-next-line
    const handleChange = (v: any) => {
      props.onChange(v);
    };
    return () => {
      const { schema, value } = props;
      return (
        <SchemaItem schema={schema} value={value} onChange={handleChange} />
      );
    };
  },
});
