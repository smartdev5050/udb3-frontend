<template>
  <table class="table table-events">
    <thead>
      <tr>
        <th scope="col" class="test">
          <span class="events-in-production-label">
            {{
              `${$t('productions.events')} ${$t(
                'productions.in',
              )} '${selectedProductionName}'`
            }}
          </span>
          <a class="add-event-link" @click="handleClickAddEvent">{{
            !isAddEventVisible ? $t('productions.create') : ''
          }}</a>
          <div v-if="isAddEventVisible" class="add-event-container">
            <input
              v-model="value"
              type="text"
              class="form-control"
              placeholder="cdbid"
            />
            <b-button variant="success"><fa icon="check" /></b-button>
          </div>
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
    data: () => ({
      isAddEventVisible: false,
    }),
    computed: {
      isTableVisible() {
        return !this.isLoading && this.events.length > 0;
      },
    },
    methods: {
      handleClickAddEvent() {
        this.isAddEventVisible = !this.isAddEventVisible;
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
      border-left: 5px solid lighten($color: $udb-primary-color, $amount: 50%);
    }

    th.test {
      display: inline-block;
      align-items: center;
    }

    .add-event-container {
      display: flex;
      width: auto;

      .form-control {
        width: 21.5rem;
        margin-right: 0.5rem;
      }
    }

    .add-event-link {
      color: $udb-blue;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
