<template>
  <div class="search-container">
    <div class="searchbox-container">
      <label for="search-input">{{
        $t('productions.overview.search.label')
      }}</label>
      <b-form-input
        id="search-input"
        v-model="searchInput"
        :placeholder="$t('productions.overview.search.placeholder')"
        @input="handleInputSearch"
      ></b-form-input>
    </div>
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
    .searchbox-container {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      line-height: 1rem;
    }

    label {
      font-size: 1rem;
      font-weight: 700;
      margin-right: 1rem;
      margin-bottom: 0;
    }

    input {
      max-width: 43rem;
    }
  }
</style>
