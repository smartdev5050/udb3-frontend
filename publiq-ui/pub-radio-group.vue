<template>
  <b-form-group :label="groupLabel" class="form-group">
    <b-form-radio-group stacked>
      <div
        v-for="(value, index) in values"
        :key="value"
        class="radio-container"
      >
        <input
          :id="`radio-${values[index]}`"
          v-model="selectedModel"
          type="radio"
          :value="value"
          :name="name"
          class="custom-radio"
        />
        <pub-label :id="`radio-${values[index]}`">{{
          labels[index]
        }}</pub-label>
      </div>
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
  import PubLabel from '@/publiq-ui/pub-label';

  export default {
    components: {
      PubLabel,
    },
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

  .radio-container {
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
