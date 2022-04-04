import SelectionWidget from './Selection';
import { CommonWidgetPropsDefine } from '../types';
import { defineComponent, DefineComponent } from 'vue';

const CommonWidget: DefineComponent<typeof CommonWidgetPropsDefine> = defineComponent(
  {
    props: CommonWidgetPropsDefine,
    setup() {
      return () => null;
    },
  },
);

export default {
  widgets: {
    SelectionWidget,
    TextWidget: CommonWidget,
    NumberWidget: CommonWidget,
  },
};
