import { FieldPropsDefine } from '../types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NumberField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value;
      const num = Number(value);
      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
        props.onChange(num);
      }
    };
    return () => {
      const { value } = props;
      return <input value={value} type="number" onInput={handleChange} />;
    };
  },
});
