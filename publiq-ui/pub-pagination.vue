<template>
  <b-pagination
    v-model="currentPageModel"
    :total-rows="total"
    :per-page="perPage"
    :prev-text="prevText"
    :next-text="nextText"
    hide-goto-end-buttons
    :class="{ 'hide-buttons': hideButtons }"
    prev-class="prev-btn"
    next-class="next-btn"
  />
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      currentPage: { type: Number, default: 1 },
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
    computed: {
      hideButtons() {
        return Math.ceil(this.total / this.perPage) === 1;
      },
      currentPageModel: {
        get() {
          return this.currentPage;
        },
        set(newValue) {
          this.$emit('changePage', newValue);
        },
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
