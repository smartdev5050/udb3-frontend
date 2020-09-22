<template>
  <pub-input
    id="productions-overview-search"
    class="searchbox"
    :label="$t('productions.overview.search.label')"
    :placeholder="$t('productions.overview.search.placeholder')"
    @input="handleInputSearch"
  />
</template>

<script>
  import debounce from 'lodash.debounce';
  import PubInput from '@/publiq-ui/pub-input';

  export default {
    components: {
      PubInput,
    },
    data: () => ({
      searchInput: '',
    }),
    methods: {
      emitInputSearch(value) {
        this.$emit('inputSearch', value);
      },
      handleInputSearch(value) {
        if (process.env.NODE_ENV === 'test') {
          this.emitInputSearch(value);
        } else {
          debounce((value) => {
            this.emitInputSearch(value);
          }, 1000)(value);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .searchbox {
    margin-bottom: 1rem;

    /deep/ input {
      max-width: 43rem;
    }
  }
</style>
