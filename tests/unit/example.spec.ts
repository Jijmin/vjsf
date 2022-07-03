import { mount } from '@vue/test-utils';

import JsonSchemaForm, { NumberField } from '../../lib';
import TestComponent from './utils/TestComponent';

describe('JsonSchemaForm', () => {
  it('should render correct number field', async () => {
    let value = '';
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'number',
        },
        value: value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });
    // 渲染了JsonSchemaForm组件，那可以找到NumberField节点
    const numberField = wrapper.findComponent(NumberField);
    expect(numberField.exists()).toBeTruthy();
    // numberField中触发onChange会影响JsonSchemaForm中的value的变化
    // await numberField.props('onChange')('123'); // 如果是使用第三方组件，不关注底层实现，可以这样测试
    // numberField.props('onChange')并不是触发input的Input事件实现的
    const input = numberField.find('input');
    input.element.value = '123';
    input.trigger('input');
    expect(value).toBe(123);
  });
});
