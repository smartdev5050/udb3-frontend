<template>
  <b-modal
    title-class="title"
    modal-class="modal"
    content-class="content"
    body-class="body"
    cancel-variant="outline-secondary"
    :title="title"
    :ok-title="confirmTitle"
    :cancel-title="cancelTitle"
    :visible="visible"
    :scrollable="false"
    :hide-header="!title"
    @hide="handleHide"
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
      visible: {
        type: Boolean,
        default: false,
      },
      confirmTitle: {
        type: String,
        default: 'Ok',
      },
      cancelTitle: {
        type: String,
        default: 'Cancel',
      },
    },
    methods: {
      handleHide() {
        this.$emit('hide');
      },
    },
  };
</script>

<style lang="scss" src="./pub-modal.scss" scoped></style>
