<template>
  <b-card class="card-event">
    <section class="header">
      <div>
        <p>{{ type }}</p>
        <h2>{{ title }}</h2>
        <p>{{ period }}</p>
      </div>
      <div><img :src="imageUrl" :alt="title" class="image" /></div>
    </section>
    <b-card-text>{{ description }}</b-card-text>
  </b-card>
</template>

<script>
  import { format } from 'date-fns';

  export default {
    props: {
      type: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      startDate: {
        type: Date,
        default: new Date(),
      },
      endDate: {
        type: Date,
        default: new Date(),
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
    computed: {
      period() {
        if (this.startDate === this.endDate) {
          return this.parseDate(this.startDate);
        }
        return `${this.parseDate(this.startDate)} - ${this.parseDate(
          this.endDate,
        )}`;
      },
    },
    methods: {
      parseDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
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
    }

    img {
      display: block;
      width: 10rem;
      height: 10rem;
      margin: 1rem;
      background-position: center center;
      background-repeat: no-repeat;
      object-fit: cover;
    }
  }
</style>
