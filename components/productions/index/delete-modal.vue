<template>
  <pub-modal
    :visible="isVisible"
    :confirm-title="$t('productions.overview.delete')"
    :cancel-title="$t('productions.overview.cancel')"
    @hide="handleHide"
  >
    <div class="content-container">
      {{
        eventCount > 1
          ? $t('productions.overview.delete_question_events', {
              eventCount,
              productionName,
            })
          : $t('productions.overview.delete_question_event', { productionName })
      }}
    </div>
  </pub-modal>
</template>

<script>
  import PubModal, { ModalVariant } from '@/publiq-ui/pub-modal.vue';

  export default {
    components: {
      PubModal,
    },
    props: {
      eventCount: {
        type: Number,
        default: 0,
      },
      productionName: {
        type: String,
        default: '',
      },
      isVisible: {
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
      handleHide() {
        this.$emit('hide');
      },
    },
  };
</script>

<style lang="scss">
  .modal-content button {
    text-transform: capitalize;
  }

  .content-container {
    padding: 1rem;
  }
</style>
