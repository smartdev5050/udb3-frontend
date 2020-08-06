<template>
  <b-table :items="productions" :fields="fieldsProductions">
    <template v-slot:cell(show_events)="row">
      <div @click="row.toggleDetails">
        <fa v-if="row.detailsShowing" icon="chevron-down" />
        <fa v-else icon="chevron-right" />
      </div>
    </template>

    <template v-slot:row-details="row">
      <b-card>
        <table class="table b-table">
          <template v-for="event in row.item.events">
            <tr :key="event.id">
              <td>{{ event.name[udbLanguage] }}</td>
              <td>
                <b-button variant="primary">Verwijderen</b-button>
              </td>
            </tr>
          </template>
        </table>
      </b-card>
    </template>
  </b-table>
</template>

<script>
  export default {
    name: 'ProductionsTable',
    data() {
      return {
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
      await this.mergeEventsIntoProductions();
    },
    methods: {
      async getAllProductions() {
        return await this.$api.productions.find();
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
      async mergeEventsIntoProductions() {
        const responseProductions = await this.getAllProductions();
        const productions = [];

        responseProductions.member.forEach((production) => {
          const eventIds = production.events;
          const events = [];

          eventIds.forEach(async (eventId) => {
            const event = await this.getEventById(eventId);
            if (event) {
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
      },
    },
  };
</script>

<style lang="scss"></style>
