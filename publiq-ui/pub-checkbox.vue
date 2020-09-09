<template>
  <b-form-checkbox :checked="checked" :disabled="disabled" @input="handleInput">
    <slot />
  </b-form-checkbox>
</template>

<script>
  export default {
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleInput() {
        this.$emit('toggle');
      },
    },
  };
</script>
