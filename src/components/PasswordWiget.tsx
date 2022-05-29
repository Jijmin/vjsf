import { CommonWidgetPropsDefine } from '../../lib/types';
import { defineComponent, DefineComponent } from 'vue';

import { withFormItem } from '../../lib/theme-default/FormItem';

const PasswordWidget: DefineComponent<typeof CommonWidgetPropsDefine> = withFormItem(
  defineComponent({
    name: 'PasswordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
        props.onChange(value);
      };
      return () => (
        <input
          type="password"
          value={props.value as any}
          onInput={handleChange}
        />
      );
    },
  }),
);
export default PasswordWidget;
