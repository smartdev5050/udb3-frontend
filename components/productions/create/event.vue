<template>
  <b-card>
    <section class="header">
      <div>
        <p>{{ type }}</p>
        <h2>{{ title }}</h2>
        <p>{{ formattedDate }}</p>
      </div>
      <img :src="imageUrl" :alt="title" class="image" />
    </section>
    <p>{{ description }}</p>
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
      date: {
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
      formattedDate() {
        return format(new Date(this.date), 'dd/MM/yyyy');
      },
    },
  };
</script>

<style lang="scss"></style>
