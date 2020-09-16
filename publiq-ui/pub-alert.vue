<template>
  <b-alert :variant="variant" :show="visible" :dismissible="dismissible">
    <slot />
  </b-alert>
</template>

<script>
  export default {
    props: {
      variant: {
        type: String,
        default: 'info',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      dismissible: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
