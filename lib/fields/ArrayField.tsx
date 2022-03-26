import { FieldPropsDefine } from '../types';
import { defineComponent } from 'vue';
import { useVJSContext } from '../context';
/**
 * {
 *   items: { type: string }
 * }
 *
 * {
 *   items: [
 *     { type: string },
 *     { type: number }
 *   ]
 * }
 *
 * {
 *      items: { type: string, enum: ['1', '2'] }
 * }
 */
export default defineComponent({
  name: 'ArrayField',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSContext();
    return () => {
      const SchemaItem = context.SchemaItem;
    };
  },
});
