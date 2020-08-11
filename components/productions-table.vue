<template>
  <div>
    <div class="productions-container">
      <table class="table table-striped table-hover table-productions">
        <thead>
          <tr>
            <th scope="col">{{ $t('productions.productions') }}</th>
          </tr>
        </thead>
        <tbody v-if="!isLoadingProductions">
          <tr
            v-for="production in productions"
            :key="production.production_id"
            :class="{
              selected:
                selectedProduction &&
                selectedProduction.production_id === production.production_id,
            }"
            @click="selectProduction(production)"
          >
            <td>{{ production.name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <loading-spinner />
        </tbody>
      </table>
      <table
        v-if="selectedProduction"
        class="table table-striped table-hover table-events"
      >
        <thead>
          <tr>
            <th scope="col">
              {{ $t('productions.events') }}
              <a>{{ $t('productions.create') }}</a>
            </th>
          </tr>
        </thead>
        <tbody
          v-if="
            !isLoadingEventsForProduction[selectedProduction.production_id] &&
            events[selectedProduction.production_id].length > 0
          "
        >
          <tr
            v-for="event in events[selectedProduction.production_id]"
            :key="event['@id']"
          >
            <td>
              <div class="event-item">
                <div>
                  {{ event.name[udbLanguage] }}
                  <a>
                    {{ $t('productions.delete') }}
                  </a>
                </div>
                <fa
                  v-show="!showEventDetail[event['@id']]"
                  icon="chevron-right"
                  @click="toggleEventDetail(event['@id'])"
                />
                <fa
                  v-show="showEventDetail[event['@id']]"
                  icon="chevron-down"
                  @click="toggleEventDetail(event['@id'])"
                />
              </div>
              <div v-if="showEventDetail[event['@id']]" class="event-details">
                event details
              </div>
            </td>
          </tr>
        </tbody>
        <tbody
          v-else-if="
            !isLoadingEventsForProduction[selectedProduction.production_id] &&
            events[selectedProduction.production_id].length === 0
          "
        >
          <tr class="text-center d-flex justify-content-center">
            {{
              $t('productions.no_events')
            }}
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <loading-spinner />
          </tr>
        </tbody>
      </table>
    </div>
    <pagination
      v-if="!isLoadingProductions"
      :rows="3"
      :per-page="1"
      @changePage="changePage"
    />
  </div>
</template>

<script>
  import Pagination from './pagination';
  import LoadingSpinner from './loading-spinner';

  export default {
    name: 'ProductionsTable',
    components: {
      Pagination,
      LoadingSpinner,
    },
    data() {
      return {
        isLoadingProductions: true,
        productions: [],
        isLoadingEventsForProduction: {},
        events: {},
        selectedProduction: undefined,
        showEventDetail: {},
      };
    },
    computed: {
      udbLanguage() {
        return this.$cookies.get('udb-language');
      },
    },
    async created() {
      // get the first page of productions
      await this.getProductions(0, 10);
      this.selectedProduction = this.productions[0];
    },
    methods: {
      async getAllProductions(start, limit) {
        return await this.$api.productions.find('', start, limit);
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
      async getProductions(start, limit) {
        this.isLoadingProductions = true;
        const { member } = await this.getAllProductions(start, limit);
        const productions = member;

        productions.forEach((production) => {
          this.$set(
            this.isLoadingEventsForProduction,
            production.production_id,
            true,
          );
        });

        this.productions = productions;
        this.isLoadingProductions = false;
      },
      async getEventsInProduction(productionId) {
        this.$set(this.isLoadingEventsForProduction, productionId, true);
        const events = [];

        const foundProduction = this.productions.find(
          (production) => production.production_id === productionId,
        );

        if (foundProduction) {
          await foundProduction.events.forEach(async (eventId) => {
            const foundEvent = await this.$api.events.findById(eventId);

            if (foundEvent && !foundEvent.status) {
              events.push(foundEvent);
              this.$set(this.showEventDetail, foundEvent['@id'], false);
            }
          });

          this.$set(this.events, productionId, events);
        }
        this.$set(this.isLoadingEventsForProduction, productionId, false);
      },
      async selectProduction(selectedProduction) {
        this.selectedProduction = selectedProduction;
        await this.getEventsInProduction(this.selectedProduction.production_id);
      },
      async changePage(newPage) {
        const start = (newPage - 1) * 1;
        await this.getProductions(start, 1);
      },
      toggleEventDetail(id) {
        this.$set(this.showEventDetail, id, !this.showEventDetail[id]);
      },
    },
  };
</script>

<style lang="scss">
  .productions-container {
    display: flex;
    width: 100%;
    font-weight: 400;

    .table {
      font-family: 'Open Sans', Helvetica, Arial, sans-serif;
      font-size: 15px;
    }

    .table-productions {
      width: 40% !important;

      tr {
        display: flex;
      }

      tbody {
        max-height: 80vh;
        display: block;
        overflow-y: scroll;
      }
    }

    .table-events {
      width: 60% !important;

      tr {
        display: flex;
      }

      tr > td {
        width: 100%;
      }

      tbody {
        max-height: 80vh;
        display: block;
        overflow-y: scroll;
      }

      .event-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .event-details {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: white;
      }

      .event-details .table {
        margin-bottom: 0;
      }
    }

    .selected {
      background-color: lighten(
        $color: $udb-primary-color,
        $amount: 50%
      ) !important;

      &:hover {
        background-color: lighten($udb-primary-color, 40%) !important;
      }
    }

    a {
      font-weight: 400;
      color: #004f94 !important;
    }
  }
</style>
