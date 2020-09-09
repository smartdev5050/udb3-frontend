<template>
  <pub-page>
    <section class="container-fluid productions-create-page">
      <pub-page-title>{{ $t('productions.create.title') }}</pub-page-title>
      <div v-if="suggestedEvents.length > 0">
        <p>
          <strong>{{ $t('productions.create.suggested_events') }}</strong>
          {{ eventSimilarityScore }}%
        </p>
        <section class="events-container">
          <event
            v-for="suggestedEvent in suggestedEvents"
            :id="parseEventId(suggestedEvent['@id'])"
            :key="suggestedEvent['@id']"
            :type="getEventType(suggestedEvent.terms)"
            :title="suggestedEvent.name[locale]"
            :image-url="suggestedEvent.image"
            :production-name="
              suggestedEvent.production ? suggestedEvent.production.title : ''
            "
            :description="
              suggestedEvent.description
                ? suggestedEvent.description[locale]
                : ''
            "
          />
        </section>
        <section
          v-if="availableProductions.length < 2"
          class="production-name-container"
        >
          <label for="production-name">{{
            $t('productions.create.production_name')
          }}</label>
          <vue-typeahead-bootstrap
            v-model="productionName"
            class="production-input"
            :disabled="availableProductions.length > 0"
            :data="suggestedProductionNames"
            @keyup="handleProductionInputKeyup"
            @hit="handleProductionInputHit"
          />
        </section>
        <section v-else>
          <b-form-group :label="$t('productions.create.production_name')">
            <b-form-radio
              v-for="production in availableProductions"
              :key="production.id"
              v-model="selectedSuggestedProductionId"
              :value="production.id"
              name="production"
              >{{ production.title }}</b-form-radio
            >
          </b-form-group>
        </section>

        <section class="button-container">
          <b-button
            class="button-spinner"
            variant="success"
            :disabled="!(productionName || selectedSuggestedProductionId)"
            @mousedown="handleClickLink"
          >
            <pub-loading-spinner v-if="isLinkingEventsWithProduction" />
            <span v-else>{{ $t('productions.create.link') }}</span>
          </b-button>
          <b-button variant="danger" @click="handleClickSkip">
            {{ $t('productions.create.skip') }}
          </b-button>
        </section>
      </div>
      <section v-else class="list-group-item list-group-item-warning">
        {{ $t('productions.create.no_suggested_events_found') }}
      </section>
      <pub-alert
        v-for="(errorMessage, index) in errorMessages"
        :key="index"
        :variant="alertVariant.DANGER"
        :visible="errorMessages.length > 0"
      >
        {{ errorMessage }}
      </pub-alert>
    </section>
  </pub-page>
</template>

<script>
  import { debounce } from 'lodash-es';
  import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
  import Event from '@/components/productions/create/event';
  import PubLoadingSpinner from '@/publiq-ui/pub-loading-spinner';
  import { parseId } from '@/functions/events';
  import PubPageTitle from '@/publiq-ui/pub-page-title';
  import PubPage from '@/publiq-ui/pub-page';
  import PubAlert, { AlertVariant } from '@/publiq-ui/pub-alert';

  export default {
    components: {
      Event,
      PubLoadingSpinner,
      VueTypeaheadBootstrap,
      PubPage,
      PubPageTitle,
      PubAlert,
    },
    data: () => ({
      eventSimilarityScore: 0,

      suggestedEvents: [],

      suggestedProductions: [],
      selectedSuggestedProductionId: '',

      productionName: '',

      errorMessages: [],

      isLinkingEventsWithProduction: false,
    }),
    computed: {
      locale() {
        return this.$i18n.locale;
      },
      suggestedEventIdsWithoutProduction() {
        return this.suggestedEvents
          .filter((suggestedEvent) => !suggestedEvent.production)
          .map((suggestedEvent) => this.parseEventId(suggestedEvent['@id']));
      },
      suggestedEventIds() {
        return this.suggestedEvents.map((suggestedEvent) =>
          this.parseEventId(suggestedEvent['@id']),
        );
      },
      fromProductionId() {
        return this.availableProductions.find(
          (production) => production.id !== this.selectedSuggestedProductionId,
        ).id;
      },
      availableProductions() {
        return this.suggestedEvents
          .filter((event) => event.production)
          .map((events) => events.production);
      },
      suggestedProductionNames() {
        return this.suggestedProductions.map((production) => production.name);
      },
      selectedSuggestedProductionName() {
        if (!this.selectedSuggestedProductionId) return '';
        if (this.availableProductions.length === 0) {
          return this.suggestedProductions.find(
            (suggestedProduction) =>
              suggestedProduction.production_id ===
              this.selectedSuggestedProductionId,
          ).name;
        }
        return this.availableProductions.find(
          (suggestedProduction) =>
            suggestedProduction.id === this.selectedSuggestedProductionId,
        ).title;
      },
      alertVariant() {
        return AlertVariant;
      },
    },
    async created() {
      await this.getSuggestedEvents();
    },
    methods: {
      async getSuggestedProductionsByName(options) {
        const {
          member: suggestedProductions,
        } = await this.$api.productions.find(options);

        this.suggestedProductions = suggestedProductions;
      },
      async getSuggestedEvents() {
        const {
          events = [],
          similarity = 0,
        } = await this.$api.productions.getSuggestedEvents();

        this.suggestedEvents = events;
        this.eventSimilarityScore = Math.round(similarity * 100);

        if (this.availableProductions.length === 1) {
          const foundProduction = this.suggestedEvents.find(
            (events) => events.production,
          ).production;
          this.selectedSuggestedProductionId = foundProduction.id;
          this.productionName = foundProduction.title;
        }
      },
      getEventType(terms) {
        const foundTerm =
          terms.find((term) => term.domain === 'eventtype') || {};
        return foundTerm.label ? foundTerm.label : '';
      },
      parseEventId(id) {
        return parseId(id);
      },
      async linkEventsToExistingProduction() {
        const reponses = await this.$api.productions.addEventsByIds({
          productionId: this.selectedSuggestedProductionId,
          eventIds: this.suggestedEventIdsWithoutProduction,
        });
        const errors = reponses.filter((response) => response.status);
        if (errors.length > 0) {
          this.errorMessages = errors.map((error) => error.title);
        }
      },
      async linkEventsToNewProduction() {
        const response = await this.$api.productions.createWithEvents({
          name: this.productionName,
          eventIds: this.suggestedEventIdsWithoutProduction,
        });
        if (response.status) {
          this.errorMessages = [response.title];
        }
      },
      async moveEventsFromOneProductionToAnother() {
        const response = await this.$api.productions.mergeProductions({
          fromProductionId: this.fromProductionId,
          toProductionId: this.selectedSuggestedProductionId,
        });
        if (response.status) {
          this.errorMessages = [response.title];
        }
      },
      async handleClickLink() {
        this.isLinkingEventsWithProduction = true;
        this.errorMessages = [];

        if (this.availableProductions.length === 2) {
          await this.moveEventsFromOneProductionToAnother();
        } else if (this.selectedSuggestedProductionId) {
          await this.linkEventsToExistingProduction();
        } else {
          await this.linkEventsToNewProduction();
        }

        this.isLinkingEventsWithProduction = false;

        if (this.errorMessages.length === 0) {
          this.clearAndRefreshSuggestedEvents();
        }
      },
      async handleClickSkip() {
        await this.$api.productions.skipSuggestedEvents(this.suggestedEventIds);
        this.clearAndRefreshSuggestedEvents();
      },
      async handleProductionInputKeyup() {
        const getSuggestedProductionsByName = this.getSuggestedProductionsByName(
          {
            name: this.productionName,
          },
        );
        this.selectedSuggestedProductionId = '';
        await debounce(() => getSuggestedProductionsByName, 1000);
      },
      handleProductionInputHit(value) {
        this.selectedSuggestedProductionId = this.suggestedProductions.find(
          (production) => production.name === value,
        ).production_id;
      },
      clearAndRefreshSuggestedEvents() {
        this.errorMessages = [];
        this.selectedSuggestedProductionId = '';
        this.productionName = '';
        this.suggestedProductions = [];
        this.getSuggestedEvents();
      },
    },
  };
</script>

<style lang="scss">
  .productions-create-page {
    label {
      font-size: 1rem;
      font-weight: 700;
    }

    .events-container {
      width: 100%;
      display: flex;
      margin-bottom: 1rem;
    }

    .production-name-container {
      margin-bottom: 1rem;
    }

    .production-input {
      max-width: 43rem;
    }

    .container-table-production-name {
      max-height: 14rem;
      margin-bottom: 0;
      margin-top: 0.5rem;
      overflow-y: scroll;
      position: absolute;
      width: 100%;

      table {
        margin-bottom: 0;
        background-color: white;
      }

      tr {
        background-color: $white;
      }

      .spinner-container {
        margin: 0;
      }
    }

    .button-container {
      display: flex;
      margin-bottom: 1rem;

      button {
        margin-right: 0.5rem;
      }

      .spinner-container {
        margin: 0;

        .spinner-border {
          color: $white !important;
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
</style>
