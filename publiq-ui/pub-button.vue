<template>
  <b-button
    v-bind="$attrs"
    :disabled="disabled"
    :variant="variant"
    @click="handleClick"
  >
    <slot />
  </b-button>
</template>

<style lang="scss" scoped></style>

<script>
  export const ButtonVariant = {
    PRIMARY: 'primary',
    SECONDARY: 'outline-secondary',
    SUCCESS: 'success',
    DANGER: 'danger',
  };

  export default {
    name: 'PubButton',
    props: {
      variant: {
        type: String,
        default: ButtonVariant.PRIMARY,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  };
</script>
