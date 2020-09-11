<template>
  <b-pagination
    v-model="currentPage"
    :total-rows="total"
    :per-page="perPage"
    :prev-text="prevText"
    :next-text="nextText"
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
      total: { type: Number, default: 1 },
      perPage: { type: Number, default: 10 },
      limit: { type: Number, default: 10 },
      prevText: {
        type: String,
        default: 'Previous',
      },
      nextText: {
        type: String,
        default: 'Next',
      },
    },
    data: () => ({
      currentPage: 1,
    }),
    computed: {
      hideButtons() {
        return Math.ceil(this.total / this.perPage) === 1;
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

    /deep/ .page-item.active .page-link {
      z-index: 0;
    }

    /deep/ .prev-btn .page-link {
      margin-right: 0.2rem;
    }

    /deep/ .next-btn .page-link {
      margin-left: 0.2rem;
    }

    &.hide-buttons {
      /deep/ .prev-btn {
        display: none;
      }

      /deep/ .next-btn {
        display: none;
      }
    }
  }
</style>
