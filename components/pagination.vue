<template>
  <b-pagination
    v-model="currentPage"
    :total-rows="rows"
    :per-page="perPage"
    :prev-text="$t('pagination.previous')"
    :next-text="$t('pagination.next')"
    hide-goto-end-buttons
    :class="{ 'hide-buttons': hideButtons }"
    @input="handleInput"
  />
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      rows: { type: Number, default: 1 },
      perPage: { type: Number, default: 10 },
      limit: { type: Number, default: 10 },
    },
    data: () => ({
      currentPage: 1,
    }),
    computed: {
      hideButtons() {
        return Math.ceil(this.rows / this.perPage) === 1;
      },
    },
    methods: {
      handleInput() {
        this.$emit('changePage', this.currentPage);
      },
    },
  };
</script>

<style lang="scss">
  .pagination {
    justify-content: center;

    .page-item.active .page-link {
      z-index: 0;
    }

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
