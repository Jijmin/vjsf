import { mount } from '@vue/test-utils';

import { NumberField, StringField } from '../../lib';
import TestComponent from './utils/TestComponent';

describe('ObjectField', () => {
  let schema: any;
  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
    };
  });
  it('should render properties to corrent fields', async () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema,
        value: {},
        onChange: () => {
          console.log('onChange');
        },
      },
    });

    const strField = wrapper.findComponent(StringField);
    const numField = wrapper.findComponent(NumberField);

    expect(strField.exists()).toBeTruthy(); // 需要渲染 StringField 组件
    expect(numField.exists()).toBeTruthy(); // 需要渲染 NumberField 组件
  });

  it('should change value when sub fields trigger onChange', async () => {
    let value: any = {};
    const wrapper = mount(TestComponent, {
      props: {
        schema,
        value: value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const strField = wrapper.findComponent(StringField);
    await strField.props('onChange')('1');
    expect(value.name).toEqual('1');

    const numField = wrapper.findComponent(NumberField);
    await numField.props('onChange')(1);
    expect(value.age).toEqual(1);
  });

  it('should render properties to undefined', async () => {
    let value: any = {
      name: '123',
    };
    const wrapper = mount(TestComponent, {
      props: {
        schema,
        value: value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const strField = wrapper.findComponent(StringField);
    await strField.props('onChange')(undefined);
    expect(value.name).toBeUndefined();
  });
});
