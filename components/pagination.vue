<template>
  <div class="pagination-container">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      :prev-text="$t('actions.previous')"
      :next-text="$t('actions.next')"
      hide-goto-end-buttons
    />
  </div>
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      currentPage: { type: Number, default: 1 },
      rows: { type: Number, default: 1 },
      perPage: { type: Number, default: 1 },
    },
  };
</script>

<style lang="scss">
  ul.pagination {
    .page-item:first-child .page-link {
      margin-right: 0.2rem;
    }

    .page-item:last-child .page-link {
      margin-left: 0.2rem;
    }
  }
</style>
