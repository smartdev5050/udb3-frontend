<template>
  <div>
    <b-table
      striped
      bordered
      :items="productions"
      :fields="fieldsProductions"
      :busy="isLoadingProductions"
      hover
    >
      <template v-slot:cell(showEvents)="row">
        <div @click="handleToggleDetails(row)">
          <fa v-if="row.detailsShowing" icon="chevron-down" />
          <fa v-else icon="chevron-right" />
        </div>
      </template>

      <template v-slot:row-details="row">
        <!-- if the events are done loading and there are events -->
        <div
          v-if="
            !isLoadingEventsForProduction[row.item.production_id] &&
            events[row.item.production_id]
          "
        >
          <table class="table b-table table-bordered table-hover table-detail">
            <template v-for="event in events[row.item.production_id]">
              <tr :key="event.id">
                <td>{{ event.name[udbLanguage] }}</td>
                <td>
                  <a href="#">{{ $t('productions.delete') }}</a>
                </td>
              </tr>
            </template>
          </table>
          <a href="#">{{ $t('productions.create') }}</a>
        </div>
        <!-- if the events are done loading and there are no events -->
        <div
          v-else-if="
            !isLoadingEventsForProduction[row.item.production_id] &&
            !events[row.item.production_id]
          "
        >
          <table class="table b-table table-bordered table-hover table-detail">
            <tr>
              <td>{{ $t('productions.no_events') }}</td>
            </tr>
          </table>
        </div>
        <!-- if the events aren't done loading -->
        <div v-else>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>{{ $t('productions.loading') + '...' }}</strong>
          </div>
        </div>
      </template>

      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>{{ $t('productions.loading') + '...' }}</strong>
        </div>
      </template>
    </b-table>
    <pagination
      v-if="!isLoadingProductions"
      :rows="3"
      :per-page="1"
      @changePage="changePage()"
    />
  </div>
</template>

<script>
  import Pagination from './pagination';

  export default {
    name: 'ProductionsTable',
    components: {
      Pagination,
    },
    data() {
      return {
        isLoadingProductions: true,
        fieldsProductions: [
          {
            key: 'name',
            label: 'Naam',
            sortable: true,
          },
          {
            key: 'showEvents',
            label: 'Opties',
          },
        ],
        productions: [],
        isLoadingEventsForProduction: {},
        fieldsEvents: [
          {
            key: 'name',
            label: 'Naam',
            sortable: true,
          },
          {
            key: 'delete_event',
            label: 'Opties',
          },
        ],
        events: {},
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
        const responseProductions = await this.getAllProductions(start, limit);
        const productions = [];

        responseProductions.member.forEach((production) => {
          productions.push({
            ...production,
            showEvents: false,
          });

          this.isLoadingEventsForProduction[production.production_id] = true;
        });

        this.productions = productions;
        this.isLoadingProductions = false;
      },
      async getEventsInProduction(productionId) {
        this.isLoadingEventsForProduction[productionId] = true;
        const events = [];

        const foundProduction = this.productions.find(
          (production) => production.production_id === productionId,
        );

        if (foundProduction) {
          await foundProduction.events.forEach(async (eventId) => {
            const foundEvent = await this.$api.events.findById(eventId);

            if (foundEvent && !foundEvent.status) {
              events.push(foundEvent);
            }
          });

          this.events[productionId] = events;
          console.log(this.events);
        }
        this.isLoadingEventsForProduction[productionId] = false;
      },
      async handleToggleDetails(row) {
        console.log(row.item._showDetails);
        if (row.item._showDetails !== true) {
          await this.getEventsInProduction(row.item.production_id);
        }
        row.toggleDetails();
      },
      async changePage(newPage) {
        const start = (newPage - 1) * 1;
        await this.getProductions(start, 1);
      },
    },
  };
</script>

<style lang="scss">
  .table-detail > tr {
    background-color: #f5f5f5 !important;
  }
</style>
