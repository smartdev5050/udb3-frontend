<template>
  <section>
    <pub-title class="productions-title">{{
      $t('productions.overview.production')
    }}</pub-title>
    <pub-panel v-if="!isLoading && productions.length > 0">
      <pub-list
        class="productions"
        :aria-label="$t('productions.overview.aria.productions')"
      >
        <pub-list-item
          v-for="production in productions"
          :key="production.production_id"
          :class="{
            selected: selectedId === production.production_id,
          }"
          @click="handleClickProduction(production.production_id)"
        >
          <a :title="production.name">
            {{ production.name }}
          </a>
        </pub-list-item>
      </pub-list>
      <pub-panel-footer>
        <pub-pagination
          :current-page="currentPage"
          :total="totalItems"
          :per-page="productionsPerPage"
          :prev-text="$t('pagination.previous')"
          :next-text="$t('pagination.next')"
          @changePage="handleChangePage"
        />
      </pub-panel-footer>
    </pub-panel>
    <div v-else-if="isLoading">
      <pub-spinner />
    </div>
    <div v-else class="text-center">
      {{ $t('productions.overview.no_productions') }}
    </div>
  </section>
</template>

<script>
  import PubSpinner from '@/publiq-ui/pub-spinner';
  import PubPanel from '@/publiq-ui/pub-panel';
  import PubPanelFooter from '@/publiq-ui/pub-panel-footer';
  import PubPagination from '@/publiq-ui/pub-pagination';
  import PubList from '@/publiq-ui/pub-list';
  import PubListItem from '@/publiq-ui/pub-list-item';
  import PubTitle from '@/publiq-ui/pub-title';

  export default {
    components: {
      PubSpinner,
      PubPanel,
      PubPanelFooter,
      PubPagination,
      PubList,
      PubListItem,
      PubTitle,
    },
    props: {
      productions: {
        type: Array,
        default: () => [],
      },
      isLoading: {
        type: Boolean,
        default: true,
      },
      selectedId: {
        type: String,
        default: '',
      },
      productionsPerPage: {
        type: Number,
        default: 15,
      },
      totalItems: {
        type: Number,
        default: 15,
      },
    },
    data() {
      return {
        currentPage: 1,
      };
    },
    methods: {
      handleClickProduction(id) {
        this.$emit('changeSelectedProductionId', id);
      },
      handleChangePage(newPage) {
        this.currentPage = newPage;
        this.$emit('changePage', this.currentPage);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .productions-title {
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
  }

  .productions {
    .list-group-item {
      border-radius: 0;
    }

    li.selected {
      background-color: $selected;
      color: $white;
    }

    li:hover {
      background-color: $selected;
      color: $white;
    }
  }
</style>
