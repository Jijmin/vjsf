import { FieldPropsDefine, Schema, SelectionWidgetNames } from '../types';
import { defineComponent, PropType } from 'vue';
import { useVJSContext } from '../context';
import { createUseStyles } from 'vue-jss';
import { getWidget } from '../theme';
// import SelectionWidget from '../widgets/Selection';

const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
});

// 处理增删改的动作
const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();

    const handleAdd = () => props.onAdd(props.index);
    const handleDown = () => props.onDown(props.index);
    const handleUp = () => props.onUp(props.index);
    const handleDelete = () => props.onDelete(props.index);

    return () => {
      const classes = classesRef.value;
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>
              新增
            </button>
            <button class={classes.action} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.action} onClick={handleUp}>
              上移
            </button>
            <button class={classes.action} onClick={handleDown}>
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      );
    };
  },
});
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
    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      arr[index] = v;

      props.onChange(arr);
    };

    const handleAdd = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      arr.splice(index + 1, 0, undefined);

      props.onChange(arr);
    };
    const handleDelete = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      // 将index项删除掉
      arr.splice(index, 1);

      props.onChange(arr);
    };
    const handleUp = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      // 如果是第一项就不需要进行处理了
      if (index === 0) return;
      const item = arr.splice(index, 1);
      arr.splice(index - 1, 0, item[0]);

      props.onChange(arr);
    };
    const handleDown = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];

      // 如果是最后一项也不需要进行处理了
      if (index === arr.length - 1) return;
      const item = arr.splice(index, 1);
      arr.splice(index + 1, 0, item[0]);

      props.onChange(arr);
    };

    const SelectionWidgetRef = getWidget(SelectionWidgetNames.SelectionWidget);

    return () => {
      const { schema, rootSchema, value } = props;
      const SchemaItem = context.SchemaItem;
      const isMultiType = Array.isArray(schema.items);
      const isSelect = schema.items && (schema.items as any).enum;

      //   const SelectionWidget = context.theme.widgets.SelectionWidget;
      const SelectionWidget = SelectionWidgetRef.value;

      if (isMultiType) {
        /**
         * { items: { type: string } }
         */
        const items: Schema[] = schema.items as any;
        const arr = Array.isArray(value) ? value : [];
        return items.map((s: Schema, index: number) => (
          <SchemaItem
            schema={s}
            rootSchema={rootSchema}
            value={arr[index]}
            onChange={(v: any) => handleArrayItemChange(v, index)}
          />
        ));
      } else if (!isSelect) {
        /**
         * { items: [ { type: string }, { type: number } ] }
         */
        // 单类型数组
        const arr = Array.isArray(value) ? value : [];
        return arr.map((v: any, index: number) => (
          <ArrayItemWrapper
            index={index}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUp={handleUp}
            onDown={handleDown}
          >
            <SchemaItem
              schema={schema.items as Schema}
              value={v}
              key={index}
              rootSchema={rootSchema}
              onChange={(v: any) => handleArrayItemChange(v, index)}
            />
          </ArrayItemWrapper>
        ));
      } else {
        /**
         * { items: { type: string, enum: ['1', '2'] } }
         */
        const enumOptions = (schema as any).items.enum;
        const options = enumOptions.map((e: any) => ({
          key: e,
          value: e,
        }));
        return (
          <SelectionWidget
            onChange={props.onChange}
            value={props.value}
            options={options}
          />
        );
      }
    };
  },
});
