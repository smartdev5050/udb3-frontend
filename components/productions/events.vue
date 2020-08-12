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
    <tbody v-else-if="isLoading">
      <tr>
        <loading-spinner />
      </tr>
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
  import LoadingSpinner from '../loading-spinner';
  import Event from './event';

  export default {
    components: {
      LoadingSpinner,
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
