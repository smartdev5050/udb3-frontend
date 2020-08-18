<template>
  <div class="search-container">
    <b-form-group
      id="fieldset-horizontal"
      label-cols-sm="4"
      label-cols-lg="2"
      label-size="lg"
      :label="$t('productions.search.label')"
      label-for="search-input"
    >
      <b-form-input
        id="search-input"
        v-model="searchInput"
        @input="handleInputSearch"
      ></b-form-input>
    </b-form-group>
    <b-alert show variant="info">{{ $t('productions.search.info') }}</b-alert>
  </div>
</template>

<script>
  import { debounce } from 'lodash-es';

  export default {
    data: () => ({
      searchInput: '',
    }),
    methods: {
      handleInputSearch: debounce(function () {
        this.$emit('inputSearch', this.searchInput);
      }, 1000),
    },
  };
</script>

<style lang="scss">
  .search-container {
    .form-row {
      align-items: center;
    }
  }
</style>
