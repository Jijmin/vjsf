import {
  defineComponent,
  PropType,
  provide,
  Ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import { Schema, Theme } from './types';
import SchemaItem from './SchemaItem';
import { SchemaFormContextKey } from './context';
import Ajv, { Options } from 'ajv';

interface ContextRef {
  doValidate: () => {
    errors: any[];
    valid: boolean;
  };
}

// 默认的一些ajv的配置
const defaultAjvOptions: Options = {
  allErrors: true,
  jsonPointers: true,
};

export default defineComponent({
  name: 'SchemaForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      // 创建ajv实例的配置项
      type: Object as PropType<Options>,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true,
    // },
  },
  setup(props, { slots, emit, attrs }) {
    // 这里还可以进行一些中转的处理操作
    const handleChange = (v: any) => {
      props.onChange(v);
    };

    // 解决循环引用问题，如果直接是object形式，不是一个响应式的，这里的变化不会被更新到inject的地方
    // const context: any = reactive({
    //   SchemaItem,
    // });
    // 不过我们这里SchemaItem是一个固定的组件，不会进行动态变化，直接使用普通对象就可以了
    const context: any = {
      SchemaItem,
      //   theme: props.theme,
    };

    // 创建ajv的实例,props.ajvOptions可能是会更新的，需要使用watchEffect
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any;
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });
    });

    // props.contextRef可能是一个undefined
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              console.log('------------->');
              // 进行表单校验, validate有可能会返回PromiseLike，在ajv中有提供异步校验的功能，但是这边目前没有异步，这里返回的肯定是boolean
              const valid = validatorRef.value.validate(
                props.schema,
                props.value,
              ) as boolean;
              return {
                valid,
                errors: validatorRef.value.errors || [],
              };
            },
          };
        }
      },
      { immediate: true },
    );

    // 直接这样使用不好维护，万一父节点更改，会影响所有使用的地方。而且后面别的地方又provide了vjsf会被覆盖
    // provide('vjsf', context);
    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value } = props;
      return (
        <SchemaItem
          schema={schema}
          value={value}
          rootSchema={schema}
          onChange={handleChange}
        />
      );
    };
  },
});
