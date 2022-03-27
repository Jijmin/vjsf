import { FieldPropsDefine } from '../types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      //   console.log(e);
      // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
      props.onChange(e.target.value);
    };
    return () => {
      const { value } = props;
      return <input value={value} onInput={handleChange} />;
    };
  },
});
