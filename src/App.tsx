import { defineComponent, ref, Ref } from 'vue';
import MonacoEditor from './components/MonacoEditor';
import { createUseStyles } from 'vue-jss';

// eslint-disable-next-line
function toJson(data: any) {
  return JSON.stringify(data, null, 2);
}
const schema = {
  type: 'string',
};
const useStyles = createUseStyles({
  editor: {
    minHeight: 400,
  },
});

export default defineComponent({
  setup() {
    // eslint-disable-next-line
    const schemaRef: Ref<any> = ref(schema);
    const handleCodeChange = (code: string) => {
      // eslint-disable-next-line
      let schema: any;
      try {
        schema = JSON.parse(code);
      } catch (err) {
        console.log(err);
      }
      schemaRef.value = schema;
    };
    const classesRef = useStyles();

    return () => {
      const code = toJson(schemaRef.value);
      const classes = classesRef.value;
      return (
        <div>
          <MonacoEditor
            code={code}
            onChange={handleCodeChange}
            title="Schema"
            class={classes.editor}
          />
        </div>
      );
    };
  },
});
