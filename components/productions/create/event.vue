<template>
  <pub-card class="card-event">
    <section class="header">
      <div>
        <p>{{ type }}</p>
        <h2>{{ title }}</h2>
        <p>{{ period }}</p>
        <p>{{ `${locationName}, ${locationCity}` }}</p>
      </div>
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="image" />
    </section>
    <pub-card-paragraph>
      <p>{{ truncatedDescription }}</p>
      <section
        v-if="productionName"
        class="list-group-item list-group-item-dark"
      >
        {{ $t('productions.event.part_of_production') }}
        <strong>{{ productionName }}</strong>
      </section>
    </pub-card-paragraph>
  </pub-card>
</template>

<script>
  import { truncate } from 'lodash-es';
  import stripHTML from 'string-strip-html';
  import PubCard from '@/publiq-ui/pub-card';
  import PubCardParagraph from '@/publiq-ui/pub-card-paragraph';

  export default {
    components: {
      PubCard,
      PubCardParagraph,
    },
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
      locationName: {
        type: String,
        default: '',
      },
      locationCity: {
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
      productionName: {
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
      truncatedDescription() {
        // Convert HTML entities like &nbsp; in the description by putting it in a textarea and reading out its value.
        // See https://stackoverflow.com/a/7394787 for more info.
        const dummyInput = document.createElement('textarea');
        dummyInput.innerHTML = stripHTML(this.description).result;
        const description = dummyInput.value;

        return truncate(description, { length: 750 });
      },
    },
    async created() {
      this.period = await this.$api.events.getCalendarSummary({
        id: this.id,
        locale: this.locale,
        format: 'sm',
      });
    },
  };
</script>

<style lang="scss" scoped>
  .card-event {
    flex: 1;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 700;
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
