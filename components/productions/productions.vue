<template>
  <table class="table table-productions">
    <thead>
      <tr>
        <th scope="col">{{ $t('productions.name') }}</th>
      </tr>
    </thead>
    <tbody v-if="!isLoading">
      <tr
        v-for="production in productions"
        :key="production.production_id"
        :class="{
          selected: selectedId === production.production_id,
        }"
        @click="handleClickProduction(production.production_id)"
      >
        <td>{{ production.name }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <loading-spinner />
    </tbody>
  </table>
</template>

<script>
  import LoadingSpinner from '../loading-spinner';

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
  .table-productions {
    width: 39% !important;
    margin-right: 1%;

    tbody {
      max-height: 80vh;
      display: block;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .selected {
      background-color: lighten(
        $color: $udb-primary-color,
        $amount: 50%
      ) !important;

      &:hover {
        background-color: lighten($udb-primary-color, 40%) !important;
      }
    }
  }
</style>
