<template>
  <b-card class="card-event">
    <section class="header">
      <div>
        <p>{{ type }}</p>
        <h2>{{ title }}</h2>
        <p>{{ period }}</p>
      </div>
      <img :src="imageUrl" :alt="title" class="image" />
    </section>
    <b-card-text>{{ description }}</b-card-text>
  </b-card>
</template>

<script>
  import { parseId as parseEventId } from '@/functions/events';

  export default {
    props: {
      id: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      startDate: {
        type: String,
        default: '',
      },
      endDate: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      imageUrl: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        period: '',
      };
    },
    computed: {
      locale() {
        return this.$i18n.locale;
      },
      eventId() {
        return parseEventId(this.id);
      },
    },
    async created() {
      this.period = await this.getPeriod();
    },
    methods: {
      async getPeriod() {
        return await this.$api.events.getCalendarSummary({
          id: this.eventId,
          locale: this.locale,
        });
      },
    },
  };
</script>

<style lang="scss">
  .card-event {
    flex: 1;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    img {
      display: block;
      width: 10rem;
      height: 10rem;
      margin-left: 1rem;
      background-position: center center;
      background-repeat: no-repeat;
      object-fit: cover;
    }
  }
</style>
