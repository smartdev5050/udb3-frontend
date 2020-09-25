<template>
  <b-button :disabled="disabled" :variant="mappedVariant" @click="handleClick">
    <slot v-if="!loading" />
    <pub-spinner
      v-else
      :variant="variant === 'secondary' ? 'primary' : 'light'"
      size="small"
      class="pub-button-spinner"
    />
  </b-button>
</template>

<style lang="scss" scoped>
  .pub-button-spinner {
    height: 1.5rem;
    display: flex;
    align-items: center;
  }
</style>

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
