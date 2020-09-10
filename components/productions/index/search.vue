<template>
  <pub-input
    class="searchbox"
    :label="$t('productions.overview.search.label')"
    :placeholder="$t('productions.overview.search.placeholder')"
    @input="handleInputSearch"
  />
</template>

<script>
  import { debounce } from 'lodash-es';
  import PubInput from '@/publiq-ui/pub-input';

  export default {
    components: {
      PubInput,
    },
    data: () => ({
      searchInput: '',
    }),
    methods: {
      handleInputSearch: debounce(function (value) {
        this.$emit('inputSearch', value);
      }, 1000),
    },
  };
</script>

<style lang="scss" scoped>
  .searchbox {
    margin-bottom: 1rem;
  }

  label {
    margin-right: 1rem;
  }
</style>
