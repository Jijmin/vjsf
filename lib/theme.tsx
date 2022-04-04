import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  PropType,
  provide,
} from 'vue';
import { Theme } from '../lib/types';

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
export function getWidget(name: string) {
  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(
    THEME_PROVIDER_KEY,
  );
  if (!context) {
    throw new Error('vjsf theme required');
  }

  const widgetRef = computed(() => {
    return (context.value.widgets as any)[name];
  });

  return widgetRef;
}

export default ThemeProvider;
