<template>
  <tr>
    <td>
      <div class="event-item">
        <div>
          {{ event.name[locale] || event.name['nl'] }}
          <a class="delete-event-link" @click="handleClickDelete(event.id)">
            {{ $t('productions.delete') }}
          </a>
        </div>
        <fa
          v-show="!isDetailVisible"
          icon="chevron-right"
          @click="handleClickToggleShowDetail"
        />
        <fa
          v-show="isDetailVisible"
          icon="chevron-down"
          @click="handleClickToggleShowDetail"
        />
      </div>
      <div v-if="isDetailVisible" class="event-details">
        <table class="table">
          <tbody>
            <tr>
              <th>{{ $t('productions.title') }}</th>
              <td>
                {{ event.name[locale] || event.name['nl'] }}
              </td>
            </tr>
            <tr>
              <th>{{ $t('productions.when') }}</th>
              <td>
                {{ period }}
              </td>
            </tr>
            <tr>
              <th>{{ $t('productions.where') }}</th>
              <td>
                {{ event.location.name[locale] || event.location.name['nl'] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>

<script>
  import { parseId as parseEventId } from '@/functions/events';

  export default {
    props: {
      event: {
        type: Object,
        default: undefined,
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
      eventId() {
        return parseEventId(this.event['@id']);
      },
    },
    async created() {
      this.period = await this.getPeriod();
    },
    methods: {
      handleClickToggleShowDetail() {
        this.isDetailVisible = !this.isDetailVisible;
      },
      handleClickDelete(eventId) {
        this.$emit('clickDelete', eventId);
      },
      async getPeriod() {
        return await this.$api.events.getCalendarSummary({
          id: this.eventId,
          locale: this.locale,
        });
      },
    },
  };
</script>

<style lang="scss">
  .event-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a.delete-event-link {
      color: $udb-blue;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .event-details {
    margin-top: 1rem;
  }

  .event-details .table {
    margin-bottom: 0;
  }

  .event-details tbody {
    background-color: $lightgrey !important;
  }
</style>
