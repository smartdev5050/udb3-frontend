<template>
  <b-form-group :label="groupLabel">
    <b-form-radio
      v-for="(value, index) in values"
      :key="value"
      v-model="selectedModel"
      :value="value"
      :name="name"
      >{{ labels[index] }}</b-form-radio
    >
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
    watch: {
      selected() {
        console.log({ selected: this.selected });
      },
    },
  };
</script>
