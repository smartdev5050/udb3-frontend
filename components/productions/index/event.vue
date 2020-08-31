<template>
  <li tabindex="0" @click="handleClickToggleShowDetail">
    <a class="event-item" :title="name">
      <div class="checkbox-and-name">
        <b-form-checkbox
          name="select-event"
          checked="isSelected"
          @input="handleInputSelectEvent"
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
  </li>
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
      isSelected: {
        type: Boolean,
        default: false,
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
      handleInputSelectEvent() {
        this.$emit('select', this.id);
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
