<template>
  <b-modal
    title-class="title"
    modal-class="modal"
    content-class="content"
    body-class="body"
    size="xl"
    :scrollable="false"
    :title="title"
    :visible="visible"
    :hide-header="!title"
    hide-footer
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
    },
    methods: {
      handleHide() {
        this.$emit('hide');
      },
    },
  };
</script>

<style lang="scss" src="./pub-modal.scss" scoped></style>
