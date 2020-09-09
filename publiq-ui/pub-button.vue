<template>
  <b-button :disabled="disabled" :variant="mappedVariant" @click="handleClick">
    <slot />
  </b-button>
</template>

<style lang="scss" scoped></style>

<script>
  const ButtonVariant = {
    primary: 'primary',
    secondary: 'outline-secondary',
    success: 'success',
    danger: 'danger',
  };

  export default {
    name: 'PubButton',
    props: {
      variant: {
        type: String,
        default: 'primary',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      mappedVariant() {
        return ButtonVariant[this.variant] || ButtonVariant.primary;
      },
    },
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  };
</script>
