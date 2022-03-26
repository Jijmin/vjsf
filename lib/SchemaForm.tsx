import { defineComponent } from 'vue';
import { FieldPropsDefine } from './types';
import SchemaItem from './SchemaItem';

export default defineComponent({
  name: 'SchemaForm',
  props: FieldPropsDefine,
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
