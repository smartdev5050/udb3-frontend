<template>
  <b-button :disabled="disabled" :variant="mappedVariant" @click="handleClick">
    <slot v-if="!loading" />
    <pub-spinner
      v-else
      :variant="variant === 'secondary' ? 'primary' : 'light'"
      size="small"
    />
  </b-button>
</template>

<style lang="scss" scoped></style>

<script>
  import PubSpinner from '@/publiq-ui/pub-spinner';
  const ButtonVariant = {
    primary: 'primary',
    secondary: 'outline-secondary',
    success: 'success',
    danger: 'danger',
  };

  export default {
    name: 'PubButton',
    components: {
      PubSpinner,
    },
    props: {
      variant: {
        type: String,
        default: 'primary',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      loading: {
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
