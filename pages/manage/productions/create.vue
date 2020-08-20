<template>
  <div class="wrapper">
    <section class="container-fluid">
      <h1 class="title">
        {{ $t('productions.create') }}
      </h1>

      <p>
        <strong>{{ $t('productions.suggested_events') }}</strong>
        {{ similarityScore }}%
      </p>

      <section class="events-container">
        <event
          v-for="event in suggestedEvents"
          :id="parseEventId(event['@id'])"
          :key="event['@id']"
          :type="getEventType(event.terms)"
          :title="event.name[locale]"
          :image-url="event.image"
          :description="event.description ? event.description[locale] : ''"
        />
      </section>

      <section class="production-name-container">
        <label for="production-name">{{
          $t('productions.production_name')
        }}</label>
        <b-input id="production-name" v-model="productionName" />
      </section>

      <section class="button-container">
        <b-button variant="success" @click="handleClickLink">{{
          $t('productions.link')
        }}</b-button>
        <b-button variant="danger" @click="handleClickSkip">{{
          $t('productions.skip')
        }}</b-button>
      </section>
    </section>
  </div>
</template>

<script>
  import Event from '@/components/productions/create/event';
  import { parseId } from '@/functions/events';

  export default {
    components: {
      Event,
    },
    data: () => ({
      similarityScore: 0,
      suggestedEvents: [],
      productionName: '',
    }),
    computed: {
      locale() {
        return this.$i18n.locale;
      },
      suggestedEventIds() {
        return this.suggestedEvents.map((suggestedEvent) =>
          this.parseEventId(suggestedEvent['@id']),
        );
      },
    },
    created() {
      this.refreshSuggestedEvents();
    },
    methods: {
      async refreshSuggestedEvents() {
        this.suggestedEvents = await this.$api.productions.getSuggestedEvents();
      },
      getEventType(terms) {
        const foundTerm =
          terms.find((term) => term.domain === 'eventtype') || {};
        return foundTerm.label ? foundTerm.label : '';
      },
      parseEventId(id) {
        return parseId(id);
      },
      async handleClickLink() {
        await this.$api.productions.createWithEvents({
          name: this.productionName,
          eventIds: this.suggestedEventIds,
        });
        this.refreshSuggestedEvents();
      },
      async handleClickSkip() {
        await this.$api.productions.skipSuggestedEvents(this.suggestedEventIds);
        this.refreshSuggestedEvents();
      },
    },
  };
</script>

<style lang="scss">
  .title {
    text-transform: capitalize;
  }

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

  .button-container {
    display: flex;

    button {
      margin-right: 0.5rem;
    }
  }
</style>
