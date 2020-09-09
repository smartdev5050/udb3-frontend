<template>
  <b-form-checkbox
    :checked="isChecked"
    :disabled="isDisabled"
    @input="handleInput"
  >
    <slot />
  </b-form-checkbox>
</template>

<script>
  export default {
    props: {
      isChecked: {
        type: Boolean,
        default: false,
      },
      isDisabled: {
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
