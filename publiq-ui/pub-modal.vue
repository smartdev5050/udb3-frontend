<template>
  <b-modal
    size="xl"
    :title="title"
    :scrollable="false"
    hide-footer
    :visible="isVisible"
  >
    <slot />
  </b-modal>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      isVisible: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .modal {
    overflow-y: hidden;
  }

  ::v-deep .modal-content {
    max-height: 95vh;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }

  ::v-deep .modal-body {
    padding: 0;
  }
</style>
