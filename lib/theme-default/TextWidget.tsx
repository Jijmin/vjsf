import { CommonWidgetPropsDefine } from '../types';
import { defineComponent, DefineComponent } from 'vue';

const TextWidget: DefineComponent<typeof CommonWidgetPropsDefine> = defineComponent(
  {
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        //   console.log(e);
        // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
        props.onChange(e.target.value);
      };
      return () => <input value={props.value as any} onInput={handleChange} />;
    },
  },
);
export default TextWidget;
