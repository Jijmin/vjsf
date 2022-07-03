import { inject, Ref } from 'vue';
import { CommonFieldType, CommonWidgetDefine, Theme } from './types';

export const SchemaFormContextKey = Symbol();

export function useVJSContext() {
  const context:
    | {
        SchemaItem: CommonFieldType;
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>;
      }
    | undefined = inject(SchemaFormContextKey);
  if (!context) throw Error('SchemaForm needed');
  return context;
}
