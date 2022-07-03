import {
  computed,
  defineComponent,
  PropType,
  provide,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import {
  CommonWidgetDefine,
  CustomFormat,
  Schema,
  UISchema,
  CustomKeyword,
} from './types';
import SchemaItem from './SchemaItem';
import { SchemaFormContextKey } from './context';
import Ajv, { Options } from 'ajv';
import { validateFormData, ErrorSchema } from './validator';

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[];
    valid: boolean;
  }>;
}

// 默认的一些ajv的配置
const defaultAjvOptions: Options = {
  allErrors: true,
  //   jsonPointers: true,
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
    locale: {
      type: String,
      default: 'zh',
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>,
    },
    customKeywords: {
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
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

    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats];
        return customFormats.reduce((result, format) => {
          result[format.name] = format.component;
          return result;
        }, {} as { [key: string]: CommonWidgetDefine });
      } else {
        return {};
      }
    });

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords];
        return (schema: Schema) => {
          let newSchema = schema;
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(schema);
            }
          });
          return newSchema;
        };
      }
      return (s: Schema) => s;
    });

    // 解决循环引用问题，如果直接是object形式，不是一个响应式的，这里的变化不会被更新到inject的地方
    // const context: any = reactive({
    //   SchemaItem,
    // });
    // 不过我们这里SchemaItem是一个固定的组件，不会进行动态变化，直接使用普通对象就可以了
    const context: any = {
      SchemaItem,
      formatMapRef,
      transformSchemaRef,
      //   theme: props.theme,
    };

    // 声明一个ref，向下传递错误信息
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({});

    // 创建ajv的实例,props.ajvOptions可能是会更新的，需要使用watchEffect
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any;
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });

      // 将CustomFormat定义到Ajv上
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats];
        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition);
        });
      }

      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords];
        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition);
        });
      }
    });

    const validateResolveRef = ref();
    const validateIndex = ref(0);

    // 数据变化后重新校验的这个过程
    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate();
        }
      },
      { deep: true },
    );

    async function doValidate() {
      console.log('start validate --------->');
      const index = (validateIndex.value += 1);
      // 这里获取到错误信息
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      );
      // 如果不相等，表示这个中间又进行了validate，之前的结果不需要了，直接返回
      if (index !== validateIndex.value) return;
      console.log('end validate --------->');
      // 将错误信息赋值给errorSchemaRef，为了可以向下传递
      errorSchemaRef.value = result.errorSchema;
      // 将结果resolve出去
      validateResolveRef.value(result);
      validateResolveRef.value = undefined; // 清空
      //   return result;
    }
    // props.contextRef可能是一个undefined
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              return new Promise((resolve) => {
                validateResolveRef.value = resolve;
                doValidate();
              });
              //   console.log('------------->');
              //   //   // 进行表单校验, validate有可能会返回PromiseLike，在ajv中有提供异步校验的功能，但是这边目前没有异步，这里返回的肯定是boolean
              //   //   const valid = validatorRef.value.validate(
              //   //     props.schema,
              //   //     props.value,
              //   //   ) as boolean;
              //   // 这里获取到错误信息
              //   const result = await validateFormData(
              //     validatorRef.value,
              //     props.value,
              //     props.schema,
              //     props.locale,
              //     props.customValidate,
              //   );
              //   // 将错误信息赋值给errorSchemaRef，为了可以向下传递
              //   errorSchemaRef.value = result.errorSchema;
              //   return result;
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
      const { schema, value, uiSchema } = props;
      return (
        <SchemaItem
          schema={schema}
          value={value}
          rootSchema={schema}
          onChange={handleChange}
          uiSchema={uiSchema || {}}
          errorSchema={errorSchemaRef.value || {}}
        />
      );
    };
  },
});
