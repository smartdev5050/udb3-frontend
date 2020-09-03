<template>
  <b-modal
    v-if="variant === modalVariant.WITH_BUTTONS"
    :title="title"
    :ok-title="confirmTitle"
    :cancel-title="cancelTitle"
    cancel-variant="outline-secondary"
    :visible="isVisible"
    :scrollable="false"
    :hide-header="hideHeader"
    @ok.prevent="handleConfirm"
    @abort="handleCancel"
  >
    <slot />
  </b-modal>
  <b-modal
    v-else
    size="xl"
    :title="title"
    :scrollable="false"
    :hide-header="hideHeader"
    :hide-footer="hideFooter"
    :visible="isVisible"
  >
    <slot />
  </b-modal>
</template>

<script>
  export const ModalVariant = {
    DEFAULT: 'default',
    WITH_BUTTONS: 'with-buttons',
  };

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
      variant: {
        type: String,
        default: 'default',
      },
      confirmTitle: {
        type: String,
        default: 'Confirm',
      },
      cancelTitle: {
        type: String,
        default: 'Cancel',
      },
      hideHeader: {
        type: Boolean,
        default: false,
      },
      hideFooter: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      modalVariant() {
        return ModalVariant;
      },
    },
    methods: {
      handleConfirm() {
        this.$emit('confirm');
      },
      handleCancel() {
        this.$emit('cancel');
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
