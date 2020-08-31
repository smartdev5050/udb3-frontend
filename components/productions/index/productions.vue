<template>
  <section class="productions-container" aria-label="List of productions">
    <h2>{{ $t('productions.production') }}</h2>
    <template v-if="!isLoading && productions.length > 0">
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
    </template>
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

  export default {
    components: {
      LoadingSpinner,
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
    },
    methods: {
      handleClickProduction(id) {
        this.$emit('changeSelectedProductionId', id);
      },
    },
  };
</script>

<style lang="scss">
  .productions-container {
    width: 39%;
    margin-right: 1%;

    h2 {
      padding-top: 0.5rem;
      margin-bottom: 1.1rem;
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
