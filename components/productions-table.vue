<template>
  <div>
    <div class="productions-container">
      <table class="table table-striped table-hover table-productions">
        <thead>
          <tr>
            <th scope="col">{{ $t('productions.productions') }}</th>
          </tr>
        </thead>
        <tbody>
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
      </table>
      <table
        v-if="selectedProduction"
        class="table table-striped table-hover table-events"
      >
        <thead>
          <tr>
            <th scope="col">{{ $t('productions.events') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in events[selectedProduction.production_id]"
            :key="event.id"
          >
            <td>{{ event.name[udbLanguage] }}</td>
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

  export default {
    name: 'ProductionsTable',
    components: {
      Pagination,
    },
    data() {
      return {
        isLoadingProductions: true,
        productions: [],
        isLoadingEventsForProduction: {},
        events: {},
        selectedProduction: undefined,
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
          this.isLoadingEventsForProduction[production.production_id] = true;
        });

        this.productions = productions;
        console.log(this.productions);
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
      async selectProduction(selectedProduction) {
        this.selectedProduction = selectedProduction;
        await this.getEventsInProduction(this.selectedProduction.production_id);
      },
      async changePage(newPage) {
        const start = (newPage - 1) * 1;
        await this.getProductions(start, 1);
      },
    },
  };
</script>

<style lang="scss">
  .productions-container {
    display: flex;
    width: 100%;

    .table-productions {
      width: 40% !important;
    }

    .table-events {
      width: 60% !important;
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
  }
</style>
