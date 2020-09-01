<template>
  <b-button v-bind="$attrs" :variant="variant"><slot /></b-button>
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
    name: 'Udb3Button',
    props: {
      variant: {
        type: String,
        default: ButtonVariant.PRIMARY,
      },
    },
  };
</script>
