<template>
  <b-table :items="productions" :fields="fieldsProductions">
    <template v-slot:cell(show_events)="row">
      <b-button size="sm" @click="row.toggleDetails">
        {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
      </b-button>
    </template>

    <template v-slot:row-details="row">
      <b-table :items="row.event"></b-table>
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
      };
    },
    async created() {
      await this.updateProductions();
    },
    methods: {
      async getAllProductions() {
        return await this.$api.productions.find();
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
      async updateProductions() {
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
