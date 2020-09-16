<template>
  <pub-list-item @click="handleClickToggleShowDetail">
    <a class="event-item" :title="name">
      <div class="checkbox-and-name">
        <pub-checkbox
          :checked="isSelected"
          :disabled="isDisabled"
          @toggle="handleToggleSelectEvent"
        >
          {{ name }}
        </pub-checkbox>
      </div>
      <fa v-show="!isDetailVisible" icon="chevron-right" />
      <fa v-show="isDetailVisible" icon="chevron-down" />
    </a>
    <section
      v-if="isDetailVisible"
      class="event-details"
      aria-label="Event details"
    >
      <h3>{{ $t('productions.overview.details') }}</h3>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('productions.event.type') }}</th>
            <td>{{ type }}</td>
          </tr>
          <tr>
            <th>{{ $t('productions.event.when') }}</th>
            <td>{{ period }}</td>
          </tr>
          <tr>
            <th>{{ $t('productions.event.where') }}</th>
            <td>{{ location }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </pub-list-item>
</template>

<script>
  import PubCheckbox from '@/publiq-ui/pub-checkbox';
  import PubListItem from '@/publiq-ui/pub-list-item';

  export default {
    components: {
      PubCheckbox,
      PubListItem,
    },
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
      isDisabled: {
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
      handleToggleSelectEvent() {
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

  table {
    th {
      width: 10rem;
    }
  }
</style>
