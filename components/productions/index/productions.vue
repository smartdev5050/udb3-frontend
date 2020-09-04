<template>
  <section class="productions-container" aria-label="List of productions">
    <h2>{{ $t('productions.production') }}</h2>
    <section v-if="!isLoading && productions.length > 0" class="panel">
      <ul class="list-group">
        <li
          v-for="production in productions"
          :key="production.production_id"
          :class="{
            'list-group-item': true,
            selected: selectedId === production.production_id,
          }"
          tabindex="0"
          @click="handleClickProduction(production.production_id)"
        >
          <a :title="production.name">
            {{ production.name }}
          </a>
        </li>
      </ul>
      <div class="panel-footer">
        <pub-pagination
          :total="totalItems"
          :per-page="productionsPerPage"
          @changePage="handleChangePage"
        />
      </div>
    </section>
    <div v-else-if="isLoading">
      <loading-spinner />
    </div>
    <div v-else class="text-center">
      {{ $t('productions.no_productions') }}
    </div>
  </section>
</template>

<script>
  import LoadingSpinner from '../../loading-spinner';
  import PubPagination from '@/publiq-ui/pub-pagination';

  export default {
    components: {
      LoadingSpinner,
      PubPagination,
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
