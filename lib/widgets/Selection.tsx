import { defineComponent, ref, PropType, watch, watchEffect } from 'vue';

export default defineComponent({
  name: 'SelectionWidget',
  props: {
    value: {},
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    options: {
      type: Array as PropType<{ key: string; value: any }[]>,
      required: true,
    },
  },
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
      console.log(currentValueRef.value, '------------->');
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
});
