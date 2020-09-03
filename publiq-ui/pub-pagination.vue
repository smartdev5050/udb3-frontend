<template>
  <b-pagination
    v-model="currentPage"
    :total-rows="rows"
    :per-page="perPage"
    :prev-text="$t('pagination.previous')"
    :next-text="$t('pagination.next')"
    hide-goto-end-buttons
    :class="{ 'hide-buttons': hideButtons }"
    prev-class="prev-btn"
    next-class="next-btn"
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

<style lang="scss" scoped>
  .pagination {
    justify-content: center;

    ::v-deep .page-item.active .page-link {
      z-index: 0;
    }

    ::v-deep .prev-btn .page-link {
      margin-right: 0.2rem;
    }

    ::v-deep .next-btn .page-link {
      margin-left: 0.2rem;
    }

    &.hide-buttons {
      ::v-deep .prev-btn {
        display: none;
      }

      ::v-deep .next-btn {
        display: none;
      }
    }
  }
</style>
