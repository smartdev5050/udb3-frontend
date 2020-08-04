<template>
  <b-pagination
    v-model="currentPage"
    :total-rows="rows"
    :per-page="perPage"
    :prev-text="$t('pagination.previous')"
    :next-text="$t('pagination.next')"
    hide-goto-end-buttons
    :class="{ 'hide-buttons': hideButtons }"
  />
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      currentPage: { type: Number, default: 1 },
      rows: { type: Number, default: 1 },
      perPage: { type: Number, default: 1 },
    },
    computed: {
      hideButtons() {
        return this.rows === 1;
      },
    },
  };
</script>

<style lang="scss">
  .pagination {
    justify-content: center;

    .page-item:first-child .page-link {
      margin-right: 0.2rem;
    }

    .page-item:last-child .page-link {
      margin-left: 0.2rem;
    }

    &.hide-buttons {
      li:first-child {
        display: none;
      }

      li:last-child {
        display: none;
      }
    }
  }
</style>
