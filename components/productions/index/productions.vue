<template>
  <section class="productions-container" aria-label="List of productions">
    <h2>{{ $t('productions.overview.production') }}</h2>
    <pub-panel v-if="!isLoading && productions.length > 0">
      <pub-list>
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
          :total="totalItems"
          :per-page="productionsPerPage"
          @changePage="handleChangePage"
        />
      </pub-panel-footer>
    </pub-panel>
    <div v-else-if="isLoading">
      <loading-spinner />
    </div>
    <div v-else class="text-center">
      {{ $t('productions.overview.no_productions') }}
    </div>
  </section>
</template>

<script>
  import LoadingSpinner from '../../loading-spinner';
  import PubPanel from '@/publiq-ui/pub-panel';
  import PubPanelFooter from '@/publiq-ui/pub-panel-footer';
  import PubPagination from '@/publiq-ui/pub-pagination';
  import PubList from '@/publiq-ui/pub-list';
  import PubListItem from '@/publiq-ui/pub-list-item';

  export default {
    components: {
      LoadingSpinner,
      PubPanel,
      PubPanelFooter,
      PubPagination,
      PubList,
      PubListItem,
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
    methods: {
      handleClickProduction(id) {
        this.$emit('changeSelectedProductionId', id);
      },
      handleChangePage(newPage) {
        this.$emit('changePage', newPage);
      },
    },
  };
</script>

<style lang="scss">
  .productions-container {
    width: 39%;
    margin-right: 1%;

    h2 {
      padding: 0.5rem 0;
      margin-bottom: 0.5rem;
    }

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
