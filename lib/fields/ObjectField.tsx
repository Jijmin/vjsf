import { FieldPropsDefine } from '../types';
import { isObject } from '../utils';
import { defineComponent } from 'vue';
import { useVJSContext } from '../context';

export default defineComponent({
  name: 'ObjectField',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSContext();

    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {};
      if (v === undefined) {
        delete value[key];
      } else {
        value[key] = v;
      }
      props.onChange(value);
    };

    return () => {
      const { schema, rootSchema, value, errorSchema } = props;
      // 通过SchemaItem进行子项的创建
      const { SchemaItem } = context;
      const properties = schema.properties || {};

      const currentValue: any = isObject(value) ? value : {};

      // 遍历properties中的key进行渲染
      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          schema={properties[k]}
          rootSchema={rootSchema}
          value={currentValue[k]}
          key={index}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
          errorSchema={errorSchema[k] || {}}
        />
      ));
    };
  },
});
