<template>
  <div class="wrapper">
    <div class="container-fluid">
      <h1 class="title">
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link class="link" to="productions/create">{{
            $t('productions.create')
          }}</nuxt-link>
        </small>
      </h1>
      <search @inputSearch="handleInputSearch" />
      <div class="panel">
        <div class="productions-container">
          <div
            v-if="isLoadingProductions || productions.length > 0"
            class="productions-container"
          >
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
              :has-adding-error="hasAddingEventToProductionError"
              :can-enable-delete-button="canEnableDeleteButton"
              @addEventToProduction="handleAddEventToProduction"
              @inputEventId="handleInputEventId"
              @selectEvent="handleSelectEvent"
              @deleteEvents="handleDeleteEvents"
            />
            <delete-modal
              :production-name="selectedProductionName"
              :event-count="selectedEventIds.length"
              @confirm="handleConfirmDeleteEvent"
            />
          </div>
          <div v-else class="productions-container">
            {{ $t('productions.no_productions') }}
          </div>
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
  import Productions from '@/components/productions/index/productions';
  import Events from '@/components/productions/index/events';
  import Search from '@/components/productions/index/search';
  import DeleteModal from '@/components/productions/index/delete-modal';
  import { parseId as parseEventId } from '@/functions/events';

  export default {
    components: {
      Pagination,
      Productions,
      Events,
      Search,
      DeleteModal,
    },
    data() {
      return {
        pagesProductions: 1,
        productionsPerPage: 15,
        totalItems: 0,

        selectedProductionId: '',
        isLoadingProductions: true,
        productions: [],

        isAddingEventToProduction: false,
        hasAddingEventToProductionError: false,

        isLoadingEvents: true,
        events: [],
        selectedEventIds: [],
      };
    },
    computed: {
      locale() {
        return this.$i18n.locale;
      },
      selectedProduction() {
        return this.productions.find(
          (production) =>
            production.production_id === this.selectedProductionId,
        );
      },
      selectedProductionName() {
        return this.selectedProduction ? this.selectedProduction.name : '';
      },
      canEnableDeleteButton() {
        return this.selectedEventIds.length > 0;
      },
    },
    async created() {
      // get the first page of productions
      await this.getProductionsByName({ limit: this.productionsPerPage });
    },
    methods: {
      async handleChangeSelectedProductionId(id) {
        this.selectedEventIds = [];
        this.selectedProductionId = id;
        await this.getEventsInProduction(this.selected);
      },
      async getEventById(id) {
        return await this.$api.events.findById(id);
      },
      async getProductionsByName(options) {
        this.isLoadingProductions = true;
        const {
          member: productions,
          totalItems,
        } = await this.$api.productions.find(options);

        this.pagesProductions = Math.ceil(totalItems / this.productionsPerPage);
        this.totalItems = totalItems;

        this.productions = productions;
        if (this.productions.length > 0) {
          this.handleChangeSelectedProductionId(
            this.productions[0].production_id,
          );
        }
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
        this.hasAddingEventToProductionError = false;
        const res = await this.$api.productions.addEventById(
          this.selectedProductionId,
          eventId,
        );
        if (res.status) {
          this.hasAddingEventToProductionError = true;
        } else {
          const event = await this.$api.events.findById(eventId);
          this.events.unshift(event);
        }

        this.isAddingEventToProduction = false;
      },
      async changePage(newPage) {
        const start = (newPage - 1) * this.productionsPerPage;
        await this.getProductionsByName({
          start,
          limit: this.productionsPerPage,
        });
      },
      handleInputEventId() {
        this.hasAddingEventToProductionError = false;
      },
      handleInputSearch(searchInput) {
        this.getProductionsByName({
          name: searchInput,
          limit: this.productionsPerPage,
        });
      },
      handleSelectEvent(eventId) {
        console.log('before', this.selectedEventIds);
        const foundEventIdIndex = this.selectedEventIds.findIndex(
          (id) => id === eventId,
        );
        console.log('foundEventIdIndex', foundEventIdIndex);
        // index wasn't found
        if (foundEventIdIndex === -1) {
          this.selectedEventIds.push(eventId);
        } else if (this.selectedEventIds.length === 1) {
          this.selectedEventIds = [];
        } else {
          this.selectedEventIds = this.selectedEventIds.slice(
            foundEventIdIndex,
            foundEventIdIndex + 1,
          );
        }
        console.log('after', this.selectedEventIds);
      },
      handleDeleteEvents(eventIds) {
        this.$bvModal.show('deleteModal');
      },
      async handleConfirmDeleteEvent() {
        await this.$api.productions.deleteEventsByIds({
          productionId: this.selectedProductionId,
          eventIds: this.selectedEventIds,
        });
        this.selectedEventIds.forEach((eventId) => {
          this.deleteEventFromProduction(eventId);
        });
        this.$bvModal.hide('deleteModal');
      },
      deleteEventFromProduction(eventIdToDelete) {
        this.events = this.events.filter(
          (event) => parseEventId(event['@id']) !== eventIdToDelete,
        );

        // delete from productions
        this.productions = this.productions
          .map((production) => {
            production.events = production.events.filter(
              (eventId) => eventId !== eventIdToDelete,
            );
            if (production.events.length === 0) {
              return undefined;
            }
            return production;
          })
          .filter((production) => production !== undefined);
      },
    },
  };
</script>

<style lang="scss">
  .productions-container {
    display: flex;
    width: 100%;
    font-weight: 400;
    margin-bottom: 1rem;

    h2 {
      font-size: 1rem;
      font-weight: 700;
    }
  }

  .panel-footer {
    padding: 10px 15px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
  }
</style>
