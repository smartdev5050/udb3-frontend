<template>
  <div class="wrapper">
    <section class="container-fluid">
      <h1 class="title create-title">{{ $t('productions.create') }}</h1>

      <p>
        <strong>{{ $t('productions.suggested_events') }}</strong>
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
            suggestedEvent.description ? suggestedEvent.description[locale] : ''
          "
        />
      </section>

      <section
        v-if="availableProductions.length < 2"
        class="production-name-container"
      >
        <label for="production-name">{{
          $t('productions.production_name')
        }}</label>
        <b-input
          id="production-name"
          v-model="productionName"
          autocomplete="off"
          :disabled="availableProductions.length > 0"
          @input="handleInputProductionName"
          @focus="handleFocusProductionName"
        />
        <section
          v-show="showSuggestedProductions"
          class="container-table-production-name"
        >
          <table class="table table-hover">
            <tbody v-if="!isLoadingSuggestedProductions">
              <tr
                v-for="suggestedProduction in suggestedProductions"
                :key="suggestedProduction.production_id"
              >
                <td
                  @click="
                    handleClickProductionName(suggestedProduction.production_id)
                  "
                >
                  {{ suggestedProduction.name }}
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td>
                  <loading-spinner />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
      <section v-else>
        <b-form-group :label="$t('productions.production_name')">
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
          :disabled="!productionName"
          @mousedown="handleClickLink"
        >
          <loading-spinner v-if="isLinkingEventsWithProduction" />
          <span v-else>{{ $t('productions.link') }}</span>
        </b-button>
        <b-button variant="danger" @click="handleClickSkip">
          {{ $t('productions.skip') }}
        </b-button>
      </section>
      <b-alert
        v-for="(errorMessage, index) in errorMessages"
        :key="index"
        variant="danger"
        :show="errorMessages.length > 0"
        dismissible
        >{{ errorMessage }}</b-alert
      >
    </section>
  </div>
</template>

<script>
  import { debounce } from 'lodash-es';
  import Event from '@/components/productions/create/event';
  import LoadingSpinner from '@/components/loading-spinner';
  import { parseId } from '@/functions/events';

  export default {
    components: {
      Event,
      LoadingSpinner,
    },
    data: () => ({
      eventSimilarityScore: 0,

      suggestedEvents: [],

      isLoadingSuggestedProductions: false,
      showSuggestedProductions: false,
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
    },
    watch: {
      selectedSuggestedProductionId() {
        if (this.selectedSuggestedProductionId) {
          this.productionName = this.selectedSuggestedProductionName;
        }
      },
    },
    async created() {
      await this.getSuggestedEvents();
    },
    methods: {
      async getSuggestedProductionsByName(options) {
        this.isLoadingSuggestedProductions = true;

        const {
          member: suggestedProductions,
        } = await this.$api.productions.find(options);

        this.suggestedProductions = suggestedProductions;

        this.isLoadingSuggestedProductions = false;
      },
      async getSuggestedEvents() {
        this.suggestedEvents = await this.$api.productions.getSuggestedEvents();
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
      async handleInputProductionName() {
        this.showSuggestedProductions = true;
        const getSuggestedProductionsByName = this.getSuggestedProductionsByName(
          {
            name: this.productionName,
          },
        );
        this.selectedSuggestedProductionId = '';
        await debounce(() => getSuggestedProductionsByName, 1000);
      },
      handleClickProductionName(id) {
        this.selectedSuggestedProductionId = id;
        this.showSuggestedProductions = false;
      },
      handleFocusProductionName() {
        if (this.productionName) {
          this.showSuggestedProductions = true;
        }
      },
      handleBlurProductionName() {
        this.showSuggestedProductions = false;
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
  label {
    font-size: 1rem;
    font-weight: 700;
  }

  .events-container {
    display: flex;
    max-width: 84rem;
    margin-bottom: 1rem;
  }

  .production-name-container {
    margin-bottom: 1rem;
  }

  #production-name {
    max-width: 43rem;
  }

  .container-table-production-name {
    max-width: 43rem;
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
</style>
