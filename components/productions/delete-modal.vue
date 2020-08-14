<template>
  <b-modal
    id="deleteModal"
    :ok-title="$t('productions.delete')"
    :cancel-title="$t('productions.cancel')"
    hide-header
  >
    <div class="content-container">
      {{
        $t('productions.delete_question', {
          eventName: 'hello',
          productionTitle: 'jello',
        })
      }}
    </div>
  </b-modal>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  .modal-content button {
    text-transform: capitalize !important;
  }

  .content-container {
    padding: 1rem;
  }
</style>
