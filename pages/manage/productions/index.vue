<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link to="productions/create">
            {{ $t('actions.create') }}
          </nuxt-link>
        </small>
      </h1>
      <b-table :items="productions" :fields="fieldsProductions"> </b-table>
      <pagination />
    </div>
  </div>
</template>

<script>
  import Pagination from '../../../components/pagination';

  export default {
    components: {
      Pagination,
    },
    data() {
      return {
        fieldsProductions: ['name', 'production_id'],
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
          });
        });

        this.productions = productions;
      },
    },
  };
</script>

<style lang="scss">
  small a {
    color: #004f94;
  }
</style>
