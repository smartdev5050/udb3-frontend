<template>
  <b-modal
    cancel-variant="outline-secondary"
    title-class="title"
    :visible="visible"
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
      visible: {
        type: Boolean,
        default: false,
      },
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
  /deep/ .title {
    font-size: 1.066rem;
    font-weight: 700;
  }

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
