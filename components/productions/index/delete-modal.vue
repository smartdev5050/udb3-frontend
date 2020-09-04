<template>
  <b-modal
    id="deleteModal"
    :ok-title="$t('productions.overview.delete')"
    :cancel-title="$t('productions.overview.cancel')"
    cancel-variant="outline-secondary"
    hide-header
    @ok.prevent="handleConfirmDelete"
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
  </b-modal>
</template>

<script>
  export default {
    props: {
      eventCount: {
        type: Number,
        default: 0,
      },
      productionName: {
        type: String,
        default: '',
      },
    },
    methods: {
      handleConfirmDelete() {
        this.$emit('confirm');
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
