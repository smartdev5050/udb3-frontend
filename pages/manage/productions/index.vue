<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link to="productions/create">
            {{ $t('productions.create') }}
          </nuxt-link>
        </small>
      </h1>
      <div>
        <div class="productions-container">
          <productions
            :selected-id="selectedProductionId"
            :is-loading="isLoadingProductions"
            :productions="productions"
            @changeSelectedProductionId="handleChangeSelectedProductionId"
          />
          <events
            v-if="selectedProduction"
            :is-loading="isLoadingEvents"
            :events="events"
            :selected-production-name="selectedProduction.name"
            :is-adding="isAddingEventToProduction"
            @addEventToProduction="handleAddEventToProduction"
          />
        </div>
        <div class="panel-footer">
          <pagination
            :rows="totalItems"
            :per-page="productionsPerPage"
            @changePage="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination';
  import Productions from '@/components/productions/productions';
  import Events from '@/components/productions/events';

  export default {
    components: {
      Pagination,
      Productions,
      Events,
    },
    data() {
      return {
        pagesProductions: 1,
        productionsPerPage: 30,
        totalItems: 0,

        selectedProductionId: '',
        isLoadingProductions: true,
        productions: [],

        isAddingEventToProduction: false,

        isLoadingEvents: true,
        events: [],
      };
    },
    computed: {
      selectedProduction() {
        return this.productions.find(
          (production) =>
            production.production_id === this.selectedProductionId,
        );
      },
    },
    async created() {
      // get the first page of productions
      await this.getProductions(0, this.productionsPerPage);
    },
    methods: {
      async handleChangeSelectedProductionId(id) {
        this.selectedProductionId = id;
        await this.getEventsInProduction(this.selected);
      },
      async getAllProductions(start, limit) {
        return await this.$api.productions.find('', start, limit);
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
      async getProductions(start, limit) {
        this.isLoadingProductions = true;
        const {
          member: productions,
          totalItems,
        } = await this.getAllProductions(start, limit);

        this.pagesProductions = Math.ceil(totalItems / this.productionsPerPage);
        this.totalItems = totalItems;

        this.productions = productions;
        this.handleChangeSelectedProductionId(
          this.productions[0].production_id,
        );
        this.isLoadingProductions = false;
      },
      async getEventsInProduction() {
        this.isLoadingEvents = true;

        this.events = await this.$api.events.findByIds(
          this.selectedProduction.events,
        );

        this.isLoadingEvents = false;
      },
      async handleAddEventToProduction(eventId) {
        this.isAddingEventToProduction = true;
        const res = await this.$api.productions.addEventById(
          this.selectedProductionId,
          eventId,
        );
        console.log(res);
        const event = await this.$api.events.findById(eventId);
        this.events.unshift(event);
        this.isAddingEventToProduction = false;
      },
      async changePage(newPage) {
        const start = (newPage - 1) * this.productionsPerPage;
        await this.getProductions(start, this.productionsPerPage);
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

    a {
      font-weight: 400;
      color: $udb-blue;
    }
  }

  .panel-footer {
    padding: 10px 15px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
  }

  small a {
    color: $udb-blue;
  }
</style>
