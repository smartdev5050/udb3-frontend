<template>
  <section class="list-productions" aria-label="List of productions">
    <h2>{{ $t('productions.production') }}</h2>
    <template v-if="!isLoading && productions.length > 0">
      <ul class="list-group">
        <a
          v-for="production in productions"
          :key="production.production_id"
          :class="{
            'list-group-item': true,
            selected: selectedId === production.production_id,
          }"
          :title="production.name"
          tabindex="0"
          @click="handleClickProduction(production.production_id)"
        >
          {{ production.name }}
        </a>
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
  .list-productions {
    width: 39% !important;
    margin-right: 1%;

    h2 {
      padding-top: 0.5rem;
      margin-bottom: 1.1rem;
    }

    .list-group-item {
      border-radius: 0;
    }

    .selected {
      background-color: lighten($color: $udb-primary-color, $amount: 50%);

      &:hover {
        background-color: lighten($udb-primary-color, 40%);
      }
    }
  }
</style>
