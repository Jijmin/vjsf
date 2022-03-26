<script setup lang="ts">
import { defineProps } from 'vue';
import { FieldPropsDefine } from '../types';
const props = defineProps({ ...FieldPropsDefine });

// eslint-disable-next-line
const handleChange = (e: any) => {
  const value = e.target.value;
  const num = Number(value);
  if (Number.isNaN(num)) {
    props.onChange(undefined);
  } else {
    // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
    props.onChange(num);
  }
};
</script>

<template>
  <input type="number"
         :value="props.value"
         @input="handleChange" />
</template>