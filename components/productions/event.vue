<template>
  <tr>
    <td>
      <div class="event-item">
        <div>
          {{ event.name[locale] || event.name['nl'] }}
          <a>
            {{ $t('productions.delete') }}
          </a>
        </div>
        <fa
          v-show="!isDetailVisible"
          icon="chevron-right"
          @click="handleClickChevron"
        />
        <fa
          v-show="isDetailVisible"
          icon="chevron-down"
          @click="handleClickChevron"
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
                {{
                  `${parseDate(event.startDate)} - ${parseDate(event.endDate)}`
                }}
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
  import { format } from 'date-fns';

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
      };
    },
    computed: {
      locale() {
        return this.$i18n.locale;
      },
    },
    methods: {
      handleClickChevron() {
        this.isDetailVisible = !this.isDetailVisible;
      },
      parseDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
      },
    },
  };
</script>

<style lang="scss">
  .event-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
