<template>
  <div>
    <label v-if="label" for="typeahead">{{ label }}</label>
    <vue-typeahead-bootstrap
      v-model="searchTermModel"
      class="typeahead"
      :disabled="disabled"
      :data="data"
      @keyup="handleKeyup"
      @hit="handleHit"
    />
  </div>
</template>

<script>
  import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

  export default {
    components: {
      VueTypeaheadBootstrap,
    },
    props: {
      searchTerm: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: '',
      },
      data: {
        type: Array,
        default: () => [],
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      searchTermModel: {
        get() {
          return this.searchTerm;
        },
        set(newSearchTerm) {
          this.$emit('input', newSearchTerm);
        },
      },
    },
    methods: {
      handleKeyup() {
        this.$emit('keyup');
      },
      handleHit() {
        this.$emit('hit');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .typeahead {
    max-width: 43rem;
  }
</style>
