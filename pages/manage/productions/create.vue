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
          :key="event['@id']"
          :type="event.terms[0].domain"
          :title="event.name[locale]"
          :start-date="event.startDate"
          :end-date="event.endDate"
          :image-url="event.image"
          :description="event.description[locale]"
        />
      </section>

      <section class="production-name-container">
        <label for="production-name">{{
          $t('productions.production_name')
        }}</label>
        <b-input id="production-name" />
      </section>

      <section class="button-container">
        <b-button variant="success">{{ $t('productions.link') }}</b-button>
        <b-button variant="danger">{{ $t('productions.skip') }}</b-button>
      </section>
    </section>
  </div>
</template>

<script>
  import Event from '@/components/productions/create/event';
  import MockSuggestedEvents from '@/assets/suggested-events';

  export default {
    components: {
      Event,
    },
    data: () => ({
      similarityScore: 0,
      suggestedEvents: [],
    }),
    computed: {
      locale() {
        return this.$i18n.locale;
      },
    },
    created() {
      this.suggestedEvents = this.getSuggestedEvents();
    },
    methods: {
      getSuggestedEvents() {
        return MockSuggestedEvents;
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
