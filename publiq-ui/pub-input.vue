<template>
  <div class="input-container">
    <pub-label v-if="label" id="form-input">{{ label }}</pub-label>
    <b-form-input
      id="form-input"
      v-model="value"
      :placeholder="placeholder"
      @input="handleInput"
    ></b-form-input>
  </div>
</template>

<script>
  import PubLabel from '@/publiq-ui/pub-label';

  export default {
    components: {
      PubLabel,
    },
    props: {
      label: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    methods: {
      handleInput() {
        this.$emit('input', this.value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .input-container {
    width: 100%;
    display: flex;
    align-items: center;
    line-height: 1rem;
  }

  label {
    margin-right: 1rem;
  }

  #form-input {
    max-width: 43rem;
  }
</style>
