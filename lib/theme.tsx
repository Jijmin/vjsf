import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  PropType,
  provide,
  ref,
  ExtractPropTypes,
} from 'vue';
import {
  Theme,
  SelectionWidgetNames,
  CommonWidgetNames,
  UISchema,
  CommonWidgetDefine,
  FieldPropsDefine,
} from './types';
import { isObject } from './utils';
import { useVJSContext } from './context';

const THEME_PROVIDER_KEY = Symbol();

const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme);
    // 提供的是一个响应式的context
    provide(THEME_PROVIDER_KEY, context);
    return () => slots.default && slots.default();
  },
});

// 在组件具体使用widget的时候才会调用
export function getWidget<T extends SelectionWidgetNames | CommonWidgetNames>(
  name: T,
  props?: ExtractPropTypes<typeof FieldPropsDefine>,
) {
  const formContext = useVJSContext();

  if (props) {
    const { uiSchema, schema } = props;
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return ref(uiSchema.widget as CommonWidgetDefine);
    }

    if (schema.format) {
      if (formContext.formatMapRef.value[schema.format]) {
        return ref(formContext.formatMapRef.value[schema.format]);
      }
    }
  }
  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(
    THEME_PROVIDER_KEY,
  );
  if (!context) {
    throw new Error('vjsf theme required');
  }

  const widgetRef = computed(() => {
    return context.value.widgets[name];
  });

  return widgetRef;
}

export default ThemeProvider;
