<template>
  <b-alert :variant="variant" :show="visible" dismissible>
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
      visible: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
