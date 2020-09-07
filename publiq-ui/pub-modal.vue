<template>
  <b-modal
    v-bind="$attrs"
    cancel-variant="outline-secondary"
    :scrollable="false"
    :hide-footer="isContentVariant"
    :hide-header="isQuestionVariant"
    :size="isContentVariant ? 'xl' : 'md'"
    v-on="$listeners"
  >
    <slot />
  </b-modal>
</template>

<script>
  export const ModalVariant = {
    QUESTION: 'question',
    CONTENT: 'content',
  };

  export default {
    props: {
      variant: {
        type: String,
        default: ModalVariant.QUESTION,
      },
    },
    computed: {
      isQuestionVariant() {
        return this.variant === ModalVariant.QUESTION;
      },
      isContentVariant() {
        return this.variant === ModalVariant.CONTENT;
      },
    },
  };
</script>

<style lang="scss" scoped>
  /deep/ .modal {
    overflow-y: hidden;
  }

  /deep/ .modal-content {
    max-height: 95vh;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }

  /deep/ .modal-body {
    padding: 0;
  }
</style>
