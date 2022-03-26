import { defineComponent, ref, Ref, reactive, watchEffect } from 'vue';
import { createUseStyles } from 'vue-jss';

import MonacoEditor from './components/MonacoEditor';

import demos from './demos';

import SchemaForm from '../lib';

// TODO: 在lib中export
// eslint-disable-next-line
type Schema = any;
// eslint-disable-next-line
type UISchema = any;

// eslint-disable-next-line
function toJson(data: any) {
  return JSON.stringify(data, null, 2);
}

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '1200px',
    margin: '0 auto',
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      width: '46%',
    },
  },
  content: {
    display: 'flex',
  },
  form: {
    padding: '0 20px',
    flexGrow: 1,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    borderRadius: 5,
    '&:hover': {
      background: '#efefef',
    },
  },
  menuSelected: {
    background: '#337ab7',
    color: '#fff',
    '&:hover': {
      background: '#337ab7',
    },
  },
});

export default defineComponent({
  setup() {
    const selectedRef: Ref<number> = ref(0);
    // 对应着UI上三个schema的对象以及JSON.stringify后的字符串
    const demo: {
      schema: Schema | null;
      // eslint-disable-next-line
      data: any;
      uiSchema: UISchema | null;
      schemaCode: string;
      dataCode: string;
      uiSchemaCode: string;
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
    });

    // 有下面数据的变化，都会进行一个赋值的操作
    watchEffect(() => {
      const index = selectedRef.value;
      const d = demos[index];
      demo.schema = d.schema;
      demo.data = d.default;
      demo.uiSchema = d.uiSchema;
      demo.schemaCode = toJson(d.schema);
      demo.dataCode = toJson(d.default);
      demo.uiSchemaCode = toJson(d.uiSchema);
    });

    // eslint-disable-next-line
    const methodRef: Ref<any> = ref();

    const classesRef = useStyles();

    // eslint-disable-next-line
    const handleChange = (v: any) => {
      demo.data = v;
      demo.dataCode = toJson(v);
    };

    // 编辑器中的code更改后会触发（工厂函数）
    function handleCodeChange(
      filed: 'schema' | 'data' | 'uiSchema',
      value: string,
    ) {
      try {
        const json = JSON.parse(value);
        demo[filed] = json;
        // eslint-disable-next-line
        (demo as any)[`${filed}Code`] = value;
      } catch (err) {
        // some thing
      }
    }

    const handleSchemaChange = (v: string) => handleCodeChange('schema', v);
    const handleDataChange = (v: string) => handleCodeChange('data', v);
    const handleUISchemaChange = (v: string) => handleCodeChange('uiSchema', v);

    return () => {
      const classes = classesRef.value;
      const selected = selectedRef.value;

      //   console.log(methodRef);

      return (
        // <StyleThemeProvider>
        // <VJSFThemeProvider theme={theme as any}>
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>Vue3 JsonSchema Form</h1>
            <div>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
          <div class={classes.content}>
            <div class={classes.code}>
              <MonacoEditor
                code={demo.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={demo.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
            </div>
            <div class={classes.form}>
              <SchemaForm
                schema={demo.schema}
                value={demo.data}
                onChange={handleChange}
              />
              {/* <SchemaForm
                  schema={demo.schema!}
                  uiSchema={demo.uiSchema!}
                  onChange={handleChange}
                  contextRef={methodRef}
                  value={demo.data}
                /> */}
            </div>
          </div>
        </div>
        // </VJSFThemeProvider>
        // </StyleThemeProvider>
      );
    };
  },
});
