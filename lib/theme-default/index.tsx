import SelectionWidget from './SelectionWidget';
import TextWidget from './TextWidget';
import NumberWidget from './NumberWidget';
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
    TextWidget,
    NumberWidget,
  },
};
