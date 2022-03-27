import { shallowMount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue';
const HelloWorld = defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props) {
    return () => {
      return h('div', props.msg);
    };
  },
});

// beforeAll
describe('HelloWorld.vue', () => {
  // 预设和清理
  beforeEach(() => {
    console.log('beforeEach');
  });
  afterEach(() => {
    console.log('afterEach');
  });
  beforeAll(() => {
    console.log('beforeAll');
  });
  afterAll(() => {
    console.log('afterAll');
  });

  // beforeEach
  //   it('renders props.msg when passed', (done) => {
  it('renders props.msg when passed', async () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    // 断言
    // expect(wrapper.text()).toEqual(msg);
    // 异步
    // setTimeout(() => {
    //   expect(wrapper.text()).toEqual(msg);
    //   done();
    // });
    // return new Promise<void>((resolve) => {
    //   expect(wrapper.text()).toEqual('123');
    //   resolve();
    // });
    await wrapper.setProps({
      msg: '123',
    });
    expect(wrapper.text()).toEqual('123');
  });
  // afterEach

  // beforeEach
  // 需要语义化
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
  // afterEach
});
// afterAll

describe('another', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
