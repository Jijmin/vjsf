import { CommonWidgetPropsDefine } from '../types';
import { defineComponent, DefineComponent } from 'vue';

const NumberWidget: DefineComponent<typeof CommonWidgetPropsDefine> = defineComponent(
  {
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        props.onChange(value);
      };
      return () => (
        <input
          type="number"
          value={props.value as any}
          onInput={handleChange}
        />
      );
    },
  },
);
export default NumberWidget;
