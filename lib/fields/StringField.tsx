import { FieldPropsDefine, CommonWidgetNames } from '../types';
import { computed, defineComponent } from 'vue';
import { getWidget } from '../theme';

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,
  setup(props) {
    // 需要在这里实现一些自定义的onChange动作，而不是直接传递父级的
    const handleChange = (v: string) => {
      //   console.log('自定义处理', v);
      //   props.onChange(v + '1');
      props.onChange(v);
    };
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props.uiSchema);
      return widgetRef.value;
    });
    return () => {
      // 但是这种方式会有问题，如果我在handleChange没有做改动，就不会双向绑定了
      const { rootSchema, errorSchema, onChange, ...rest } = props;
      const TextWidget = TextWidgetRef.value;
      // 直接将handleChange传递给 TextWidget 的 onChange 方法，发现不成功，会合并为一个数组形式，父亲的 onChange 和自定义的 onChange
      // 需要关掉配置babel.config.js {mergeProps: false} ，但是貌似没生效
      //   return <TextWidget {...rest} onChange={handleChange} />;
      return (
        <TextWidget
          {...rest}
          errors={errorSchema.__errors}
          onChange={handleChange}
        />
      );
      //   const { value } = props;
      //   return <input value={value} onInput={handleChange} />;
    };
  },
});
