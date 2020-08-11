<template>
  <div>
    <div class="productions-container">
      <table class="table table-productions">
        <thead>
          <tr>
            <th scope="col">{{ $t('productions.name') }}</th>
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
      <table v-if="selectedProduction" class="table table-events">
        <thead>
          <tr>
            <th scope="col">
              {{
                selectedProduction
                  ? `${$t('productions.events')} ${$t('productions.in')} '${
                      selectedProduction.name
                    }'`
                  : $t('productions.events')
              }}
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
                  {{ event.name[udbLanguage] || event.name['nl'] }}
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
                <table class="table">
                  <tbody>
                    <tr>
                      <th>{{ $t('productions.title') }}</th>
                      <td>{{ event.name[udbLanguage] || event.name['nl'] }}</td>
                    </tr>
                    <tr>
                      <th>{{ $t('productions.when') }}</th>
                      <td>
                        {{
                          `${parseDate(event.startDate)} - ${parseDate(
                            event.endDate,
                          )}`
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>{{ $t('productions.where') }}</th>
                      <td>
                        {{
                          event.location.name[udbLanguage] ||
                          event.location.name['nl']
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody
          v-else-if="
            isLoadingEventsForProduction[selectedProduction.production_id]
          "
        >
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
    </div>
    <div class="panel-footer">
      <pagination
        v-if="!isLoadingProductions"
        :rows="4"
        @changePage="changePage"
      />
    </div>
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
        productions: [],
        selectedProduction: undefined,
        isLoadingProductions: true,
        events: {},
        isLoadingEventsForProduction: {},
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
      await this.getProductions(0, 2);
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
            console.log(foundEvent);

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
        const start = (newPage - 1) * 2;
        await this.getProductions(start, 2);
        this.selectProduction(this.productions[0]);
      },
      toggleEventDetail(id) {
        this.$set(this.showEventDetail, id, !this.showEventDetail[id]);
      },
      parseDate(date) {
        const newDate = new Date(date);
        const day = newDate.getDay() + 1;
        const month = newDate.getMonth() + 1;
        const year = newDate.getFullYear();
        return `${day}-${month}-${year}`;
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
      background-color: none;

      thead {
        background-color: $white;
      }

      tbody {
        margin-top: 0.5rem;
        background-color: $white;
      }

      tr {
        display: inline-flex;
        width: 100%;
      }

      th {
        width: 100%;
      }

      td {
        width: 100%;
      }
    }

    .table-productions {
      width: 39% !important;
      margin-right: 1%;

      tbody {
        max-height: 80vh;
        display: block;
        overflow-y: scroll;
        overflow-x: hidden;
      }
    }

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
        background-color: #f0f0f0;
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

  .panel-footer {
    padding: 10px 15px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
  }
</style>
