import { FieldPropsDefine, CommonWidgetNames } from '../types';
import { defineComponent } from 'vue';
import { getWidget } from '../theme';

export default defineComponent({
  name: 'NumberField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      //   const value = e.target.value;
      const num = Number(v);
      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
        props.onChange(num);
      }
    };
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget);
    return () => {
      const { rootSchema, errorSchema, onChange, ...rest } = props;
      const NumberWidget = NumberWidgetRef.value;
      return (
        <NumberWidget
          {...rest}
          errors={errorSchema.__errors}
          onChange={handleChange}
        />
      );
    };
  },
});
