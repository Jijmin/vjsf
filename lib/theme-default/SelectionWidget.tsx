import { defineComponent, ref, watch, watchEffect, DefineComponent } from 'vue';
import { SelectionWidgetPropsDefine, SelectionWidgetDefine } from '../types';
import { withFormItem } from './FormItem';

// //@ts-ignore
// const Selection: SelectionWidgetDefine = defineComponent({
const Selection: DefineComponent<typeof SelectionWidgetPropsDefine> = withFormItem(
  defineComponent({
    name: 'SelectionWidget',
    props: SelectionWidgetPropsDefine,
    setup(props) {
      const currentValueRef = ref(props.value);

      // 监听子组件中的currentValueRef数据变化，变化后调用父组件onChange方法更改props.value的值
      watch(currentValueRef, (newv, oldv) => {
        if (newv !== props.value) props.onChange(newv);
      });
      // 监听父组件中的props.value改变，如果改变要将子组件中的currentValueRef.value重新赋值
      watch(
        () => props.value,
        (v) => {
          if (v !== currentValueRef.value) currentValueRef.value = v;
        },
      );
      watchEffect(() => {
        //   console.log(currentValueRef.value, '------------->');
      });

      return () => {
        const { options } = props;
        return (
          <select multiple={true} v-model={currentValueRef.value}>
            {options.map((op) => (
              <option value={op.value}>{op.key}</option>
            ))}
          </select>
        );
      };
    },
  }),
);
export default Selection;
