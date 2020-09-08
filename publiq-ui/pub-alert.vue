<template>
  <b-alert :variant="variant" :show="show" dismissible>
    <slot />
  </b-alert>
</template>

<script>
  export const AlertVariant = {
    DANGER: 'danger',
    INFO: 'info',
    SUCCESS: 'success',
  };

  export default {
    props: {
      variant: {
        type: String,
        default: AlertVariant.INFO,
      },
      show: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
