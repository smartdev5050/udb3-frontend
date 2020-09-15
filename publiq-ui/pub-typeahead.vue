<template>
  <div>
    <pub-label v-if="label" id="typeahead">{{ label }}</pub-label>
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
  import PubLabel from '@/publiq-ui/pub-label';

  export default {
    components: {
      VueTypeaheadBootstrap,
      PubLabel,
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
      handleHit(value) {
        this.$emit('hit', value);
      },
    },
  };
</script>

<style lang="scss" scoped></style>
