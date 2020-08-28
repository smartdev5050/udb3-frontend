<template>
  <b-modal
    id="deleteModal"
    :ok-title="$t('productions.delete')"
    :cancel-title="$t('productions.cancel')"
    hide-header
    @ok.prevent="handleConfirmDelete"
  >
    <div class="content-container">
      {{
        $t('productions.delete_question', {
          eventCount,
          productionName,
        })
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
