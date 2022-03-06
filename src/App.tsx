import { defineComponent, reactive, ref } from 'vue';
const img = require('./assets/logo.png'); // eslint-disable-line

export default defineComponent({
  setup() {
    const state = reactive({
      name: 'zoe',
    });
    const numberRef = ref(1);
    setInterval(() => {
      state.name += '1';
      numberRef.value += 1;
    }, 1000);
    return () => {
      const number = numberRef.value;
      return (
        <div id="app">
          <img src={img} alt="Vue log" />
          <p>{state.name + number}</p>
        </div>
      );
    };
  },
});
