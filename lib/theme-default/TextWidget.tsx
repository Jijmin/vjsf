import { CommonWidgetPropsDefine } from '../types';
import { computed, defineComponent, DefineComponent } from 'vue';

import { withFormItem } from './FormItem';

const TextWidget: DefineComponent<typeof CommonWidgetPropsDefine> = withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
        props.onChange(value);
        // nextTick(() => {
        //   if (props.value !== e.target.value) {
        //     e.target.value = props.value;
        //   }
        // });
      };
      const styleRef = computed(() => {
        return {
          color: (props.options && props.options.color) || 'black',
        };
      });
      return () => (
        <input
          value={props.value as any}
          onInput={handleChange}
          style={styleRef.value}
        />
      );
    },
  }),
);
export default TextWidget;
