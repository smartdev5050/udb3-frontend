<template>
  <section>
    <a
      class="event-item"
      tabindex="0"
      :title="name"
      @click="handleClickToggleShowDetail"
    >
      <div class="checkbox-and-name">
        <b-form-checkbox
          v-model="isSelected"
          name="select-event"
          @click="handleClickSelect"
        />
        <span>{{ name }}</span>
      </div>
      <fa v-show="!isDetailVisible" icon="chevron-right" />
      <fa v-show="isDetailVisible" icon="chevron-down" />
    </a>
    <section
      v-if="isDetailVisible"
      class="event-details"
      aria-label="Event details"
    >
      <h3>{{ $t('productions.details') }}</h3>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('productions.type') }}</th>
            <td>{{ type }}</td>
          </tr>
          <tr>
            <th>{{ $t('productions.when') }}</th>
            <td>{{ period }}</td>
          </tr>
          <tr>
            <th>{{ $t('productions.where') }}</th>
            <td>{{ location }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      location: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isDetailVisible: false,
        period: '',
      };
    },
    computed: {
      locale() {
        return this.$i18n.locale;
      },
    },
    async created() {
      this.period = await this.$api.events.getCalendarSummary({
        id: this.id,
        locale: this.locale,
        format: 'sm',
      });
    },
    methods: {
      handleClickToggleShowDetail() {
        this.isDetailVisible = !this.isDetailVisible;
      },
      handleClickSelect() {
        this.$emit('clickSelect', this.id);
      },
    },
  };
</script>

<style lang="scss">
  .checkbox-and-name {
    display: inline-block;
  }

  .custom-checkbox {
    display: inline-block;
  }

  .event-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .event-details {
    margin-top: 1rem;
    background-color: $lightgrey;

    h3 {
      display: none;
    }
  }
</style>
