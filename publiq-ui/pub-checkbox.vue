<template>
  <div class="container-checkbox">
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :checked="checked"
      :disabled="disabled"
      @input="handleInput"
    />
    <pub-label :id="id"><slot /></pub-label>
  </div>
</template>

<script>
  import PubLabel from '@/publiq-ui/pub-label';
  export default {
    components: {
      PubLabel,
    },
    props: {
      id: {
        type: String,
        default: '',
        required: true,
      },
      name: {
        type: String,
        default: '',
      },
      checked: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleInput() {
        this.$emit('toggle');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .container-checkbox {
    display: flex;
    align-items: center;
  }

  input {
    margin-right: 0.5rem;
  }

  input:hover {
    cursor: pointer;
  }

  label:hover {
    cursor: pointer;
  }
</style>
