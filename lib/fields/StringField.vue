<script setup lang="ts">
import { defineProps } from 'vue';
import { FieldPropsDefine } from '../types';
const props = defineProps({ ...FieldPropsDefine });
// eslint-disable-next-line
const handleChange = (e: any) => {
  console.log(e);
  // 这里的props是setup进行编译后放到setup内部闭包中的值，这里需要进行声明下
  props.onChange(e.target.value);
};
</script>

<template>
  <input type="text"
         :value="props.value"
         @input="handleChange" />
</template>