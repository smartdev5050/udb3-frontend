<template>
  <b-table
    striped
    bordered
    :items="productions"
    :fields="fieldsProductions"
    :busy="loading"
    hover
  >
    <template v-slot:cell(show_events)="row">
      <div @click="row.toggleDetails">
        <fa v-if="row.detailsShowing" icon="chevron-down" />
        <fa v-else icon="chevron-right" />
      </div>
    </template>

    <template v-slot:row-details="row">
      <div v-if="row.item.events && row.item.events.length > 0">
        <table class="table b-table table-bordered table-hover table-detail">
          <template v-for="event in row.item.events">
            <tr :key="event.id">
              <td>{{ event.name[udbLanguage] }}</td>
              <td>
                <a href="#">verwijderen</a>
              </td>
            </tr>
          </template>
        </table>
        <a href="#">toevoegen</a>
      </div>
      <div v-else>
        <table class="table b-table table-bordered table-hover">
          <tr>
            <td>Geen eventementen onder deze productie</td>
          </tr>
        </table>
      </div>
    </template>

    <template v-slot:table-busy>
      <div class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </template>
  </b-table>
    <pagination v-if="!loading" :rows="2" :per-page="1" />
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
        loading: true,
        fieldsProductions: [
          {
            key: 'name',
            label: 'Naam',
            sortable: true,
          },
          {
            key: 'show_events',
            label: 'Opties',
          },
        ],
        productions: [],
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
      };
    },
    computed: {
      udbLanguage() {
        return this.$cookies.get('udb-language');
      },
    },
    async created() {
      // get the first page of productions
      await this.mergeEventsIntoProductions(0, 1);
    },
    methods: {
      async getAllProductions(offset, limit) {
        return await this.$api.productions.find('', offset, limit);
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
      async mergeEventsIntoProductions(offset, limit) {
        this.loading = true;
        const responseProductions = await this.getAllProductions(offset, limit);
        const productions = [];

        responseProductions.member.forEach((production) => {
          const eventIds = production.events;
          const events = [];

          eventIds.forEach(async (eventId) => {
            const event = await this.getEventById(eventId);
            const eventExists = !event.status;
            if (event && eventExists) {
              events.push(event);
            }
          });

          productions.push({
            name: production.name,
            production_id: production.production_id,
            events,
            show_events: false,
          });
        });

        this.productions = productions;
        this.loading = false;
        console.log({ productions: this.productions });
      },
    },
  };
</script>

<style lang="scss">
  .table-detail > tr {
    background-color: #f5f5f5 !important;
  }
</style>
