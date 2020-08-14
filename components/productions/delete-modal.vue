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
          eventName,
          productionTitle,
        })
      }}
    </div>
  </b-modal>
</template>

<script>
  export default {
    props: {
      eventName: {
        type: String,
        default: '',
      },
      productionTitle: {
        type: String,
        default: '',
      },
    },
    methods: {
      handleConfirmDelete() {
        this.$emit('confirmDelete');
      },
    },
  };
</script>

<style lang="scss">
  .modal-content button {
    text-transform: capitalize !important;
  }

  .content-container {
    padding: 1rem;
  }
</style>
