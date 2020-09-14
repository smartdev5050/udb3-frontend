<template>
  <b-form-group :label="groupLabel" class="form-group">
    <b-form-radio-group v-model="selectedModel" stacked>
      <b-form-radio
        v-for="(value, index) in values"
        :key="value"
        :value="value"
        :name="name"
        class="custom-radio"
        >{{ labels[index] }}</b-form-radio
      >
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: '',
      },
      groupLabel: {
        type: String,
        default: '',
      },
      labels: {
        type: Array,
        default: () => [],
      },
      values: {
        type: Array,
        default: () => [],
      },
      selected: {
        type: String,
        default: '',
      },
    },
    computed: {
      selectedModel: {
        get() {
          return this.selected;
        },
        set(newSelected) {
          this.$emit('input', newSelected);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-group {
    margin: 0;
  }
  .custom-radio {
    font-weight: 700;
  }
</style>
