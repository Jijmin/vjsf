import { mount } from '@vue/test-utils';

import JsonSchemaForm, { NumberField } from '../../lib';

describe('JsonSchemaForm', () => {
  it('should render correct number field', async () => {
    let value = '';
    const wrapper = mount(JsonSchemaForm, {
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
  });
});
