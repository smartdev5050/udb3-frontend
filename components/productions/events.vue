<template>
  <table class="table table-events">
    <thead>
      <tr>
        <th scope="col">
          {{
            selectedProductionName
              ? `${$t('productions.events')} ${$t(
                  'productions.in',
                )} '${selectedProductionName}'`
              : $t('productions.events')
          }}
          <a>{{ $t('productions.create') }}</a>
        </th>
      </tr>
    </thead>
    <tbody v-if="isTableVisible">
      <event v-for="event in events" :key="event['@id']" :event="event" />
    </tbody>
    <tbody v-else>
      <tr>
        <td class="text-center">
          {{ $t('productions.no_events') }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import Event from './event';

  export default {
    components: {
      Event,
    },
    props: {
      events: {
        type: Array,
        default: () => [],
      },
      isLoading: {
        type: Boolean,
        default: true,
      },
      selectedProductionName: {
        type: String,
        default: '',
      },
    },
    computed: {
      isTableVisible() {
        return !this.isLoading && this.events.length > 0;
      },
    },
  };
</script>

<style lang="scss">
  .table-events {
    width: 60% !important;

    > tbody {
      max-height: 80vh;
      display: block;
      overflow-y: scroll;
      overflow-x: hidden;
      border-left: 5px solid #fcd1cf;
    }

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
      background-color: $lightgrey;
    }
  }
</style>
