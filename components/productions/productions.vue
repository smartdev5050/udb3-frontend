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
