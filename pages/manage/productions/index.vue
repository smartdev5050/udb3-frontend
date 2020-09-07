<template>
  <pub-wrapper>
    <div class="container-fluid productions-index-page">
      <pub-h1>
        {{ $t('menu.productions') }}
        <small>
          <nuxt-link class="link" to="productions/create">{{
            $t('productions.overview.create')
          }}</nuxt-link>
        </small>
      </pub-h1>
      <search @inputSearch="handleInputSearch" />
      <div
        v-if="isLoadingProductions || productions.length > 0"
        class="productions-events-container"
      >
        <productions
          :selected-id="selectedProductionId"
          :is-loading="isLoadingProductions"
          :productions="productions"
          :productions-per-page="productionsPerPage"
          :total-items="totalItems"
          @changeSelectedProductionId="handleChangeSelectedProductionId"
          @changePage="handleChangePage"
        />
        <events
          v-if="selectedProduction"
          :is-loading="isLoadingEvents"
          :events="events"
          :selected-production-name="selectedProduction.name"
          :selected-event-ids="selectedEventIds"
          :is-adding="isAddingEventToProduction"
          :has-adding-error="hasAddingEventToProductionError"
          @addEventToProduction="handleAddEventToProduction"
          @inputEventId="handleInputEventId"
          @selectEvent="handleSelectEvent"
          @deleteEvents="handleDeleteEvents"
        />
        <delete-modal
          :production-name="selectedProductionName"
          :event-count="selectedEventIds.length"
          :is-visible="isDeleteModalVisible"
          @confirm="handleConfirmDeleteEvent"
          @hide="handleHideDeleteModal"
        />
      </div>
      <div v-else class="productions-events-container">
        {{ $t('productions.overview.no_productions') }}
      </div>
    </div>
  </pub-wrapper>
</template>

<script>
  import Productions from '@/components/productions/index/productions';
  import Events from '@/components/productions/index/events';
  import Search from '@/components/productions/index/search';
  import DeleteModal from '@/components/productions/index/delete-modal';
  import { parseId as parseEventId } from '@/functions/events';
  import PubWrapper from '@/publiq-ui/pub-wrapper';
  import PubH1 from '@/publiq-ui/pub-h1';

  export default {
    components: {
      Productions,
      Events,
      Search,
      DeleteModal,
      PubH1,
      PubWrapper,
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
        isDeleteModalVisible: false,

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
    },
    async created() {
      // get the first page of productions
      await this.getProductionsByName({ limit: this.productionsPerPage });
    },
    methods: {
      async handleChangeSelectedProductionId(id) {
        this.selectedEventIds = [];
        this.selectedProductionId = id;
        await this.getEventsInProduction();
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
          this.events.push(event);
        }

        this.isAddingEventToProduction = false;
      },
      async handleChangePage(newPage) {
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
        const originalLength = this.selectedEventIds.length;

        const filteredSelectedEventIds = this.selectedEventIds.filter(
          (id) => id !== eventId,
        );

        if (filteredSelectedEventIds.length !== originalLength) {
          this.selectedEventIds = filteredSelectedEventIds;
        } else {
          this.selectedEventIds.push(eventId);
        }
      },
      handleDeleteEvents(eventIds) {
        this.isDeleteModalVisible = true;
      },
      async handleConfirmDeleteEvent() {
        await this.$api.productions.deleteEventsByIds({
          productionId: this.selectedProductionId,
          eventIds: this.selectedEventIds,
        });
        this.selectedEventIds.forEach((eventId) => {
          this.deleteEventFromProduction(eventId);
        });
        this.isDeleteModalVisible = false;
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
      handleHideDeleteModal() {
        this.isDeleteModalVisible = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .productions-index-page {
    .productions-events-container {
      display: flex;
      width: 100%;
      font-weight: 400;
      margin-bottom: 1rem;

      /deep/ h2 {
        font-size: 1rem;
        font-weight: 700;
      }
    }
  }
</style>
