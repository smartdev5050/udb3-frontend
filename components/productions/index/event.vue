<template>
  <tr>
    <td>
      <div class="event-item">
        <div>
          {{ name }}
          <a class="delete-event-link" @click="handleClickDelete(id)">
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
                {{ name }}
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
                {{ location }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  </tr>
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
      });
    },
    methods: {
      handleClickToggleShowDetail() {
        this.isDetailVisible = !this.isDetailVisible;
      },
      handleClickDelete(eventId) {
        this.$emit('clickDelete', eventId);
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
