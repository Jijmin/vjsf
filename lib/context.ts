import { inject } from 'vue';
import { CommonFieldType } from './types';

export const SchemaFormContextKey = Symbol();

export function useVJSContext() {
  const context: { SchemaItem: CommonFieldType } | undefined = inject(
    SchemaFormContextKey,
  );
  if (!context) throw Error('SchemaForm needed');
  return context;
}
