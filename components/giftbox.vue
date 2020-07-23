<template>
  <div class="giftbox-wrapper">
    <div class="giftbox-button" @click="showModal">
      <fa icon="gift" class="giftbox-icon" />
    </div>
    <b-modal
      ref="giftbox-modal"
      class="giftbox-modal"
      size="xl"
      title="Nieuw in onze API en widgets"
      :scrollable="false"
      hide-footer
    >
      <div class="features-wrapper">
        <div class="features-list">
          <div
            v-for="feature in features"
            :key="feature.uid"
            :class="[
              'feature-title-block',
              { selected: feature.uid === selectedFeature.uid },
              { seen: seenFeatures.has(feature.uid) },
            ]"
            @click="switchFeature(feature.uid)"
          >
            <div class="notification-icon-wrapper">
              <fa
                v-if="!seenFeatures.has(feature.uid)"
                icon="eye"
                class="eye-icon"
              />
              <fa v-else icon="eye-slash" class="eye-icon" />
            </div>
            <p>{{ feature.title }}</p>
          </div>
        </div>
        <div v-if="selectedFeature" class="features-detail">
          <div class="title-calltoaction-container">
            <h6>{{ selectedFeature.title }}</h6>
            <a
              :href="selectedFeature.callToAction"
              :alt="selectedFeature.callToActionLabel"
              target="_blank"
              class="btn-call-to-action"
            >
              {{ selectedFeature.callToActionLabel }}
            </a>
          </div>
          <a
            v-if="selectedFeature.image"
            :href="selectedFeature.image"
            target="_blank"
          >
            <img
              :src="selectedFeature.image"
              :alt="selectedFeature.title"
              class="feature-image"
            />
          </a>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="feature-content" v-html="selectedFeature.body" />
        </div>
        <div v-else class="features-detail">
          <p>{{ $t('giftbox.no_features') }}</p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'Giftbox',
    data: () => ({
      loading: true,
      features: [],
      selectedFeature: undefined,
      seenFeatures: new Set(),
    }),
    created() {
      this.fetchFeatures().then(res => {
        this.features = res;
        if (this.features.length > 0) {
          this.selectedFeature = this.features[0];
          this.seenFeatures.add(this.selectedFeature.uid);
        }
      });  
    },
    methods: {
      async fetchFeatures() {
        this.loading = true;
        const response = await fetch(
          'https://www.publiq.be/uitdatabank/articles.json',
        );
        const data = await response.json();
        this.loading = false;
        return data.data;
      },
      showModal() {
        if (!this.loading) {
          this.$refs['giftbox-modal'].show();
        }
      },
      hideModal() {
        this.$refs['giftbox-modal'].hide();
      },
      switchFeature(uid) {
        if (uid) {
          this.selectedFeature = this.features.find(
            (feature) => feature.uid === uid,
          );
          this.seenFeatures.add(this.selectedFeature.uid);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../assets/styles/_variables';
  .giftbox-wrapper {
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    text-align: center;

    .giftbox-button {
      width: 100%;
      height: 100%;
      line-height: 100%;
      border-radius: 50%;
      background-color: $udb-primary-color;
      text-align: center;
      -webkit-box-shadow: 0px 0px 35px -8px rgba(0, 0, 0, 0.75);
      -moz-box-shadow: 0px 0px 35px -8px rgba(0, 0, 0, 0.75);
      box-shadow: 0px 0px 35px -8px rgba(0, 0, 0, 0.75);
      transition: background-color 500ms, transform 500ms;

      &:active {
        background-color: lighten($color: $udb-primary-color, $amount: 40%);
        transform: scale(0.75, 0.75);
      }
    }

    .giftbox-icon {
      color: #fff;
      width: 65%;
      height: 65%;
      position: relative;
      top: 17.5%;
    }
  }
</style>

<style lang="scss">
  @import '../assets/styles/_variables';
  $white: #ffffff;
  $grey: #efefef;

  .main-container {
    position: relative;
    z-index: 0;
  }

  .modal-open .modal {
    overflow-y: hidden;
    height: 95vh;
  }

  .modal-body {
    padding: 0;
  }

  .modal-content {
    height: 100vh;
  }

  .features-wrapper {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    border-top: $grey 2px solid;

    .features-list {
      width: 30%;
      height: 87vh;
      border-right: $grey 2px solid;
      overflow-y: scroll;

      .feature-title-block {
        border-bottom: $grey 2px solid;
        padding: 1rem;
        height: 4rem;
        line-height: 2rem;
        vertical-align: middle;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background-color 500ms;

        &:hover {
          cursor: pointer;
          background-color: darken($white, 10%);
        }

        &.selected {
          background-color: lighten($color: $udb-primary-color, $amount: 50%);

          &:hover {
            background-color: lighten($udb-primary-color, 40%);
          }
        }

        &.seen:not(.selected) {
          color: #888888;
        }

        .notification-icon-wrapper {
          width: 2rem;
          height: 2rem;
        }
      }
    }

    .features-detail {
      width: 70%;
      height: 87vh;
      padding: 1rem;
      overflow-y: scroll;

      .title-calltoaction-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: auto;
        margin-bottom: 1rem;

        h6 {
          font-weight: bold;
          vertical-align: middle;
        }

        a:hover {
          text-decoration: none;
        }

        .btn-call-to-action {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: fit-content;
          max-width: 100%;
          background: $udb-primary-color;
          color: $white;
          height: 2rem;
          line-height: 1rem;
          padding: 0.5rem 0.5rem 0.5rem 0.5rem;

          &:hover {
            background: lighten($color: $udb-primary-color, $amount: 10%);
          }
        }
      }

      .feature-image {
        width: 100%;
        height: auto;
        max-height: 30vh;
        background-position: center center;
        background-repeat: no-repeat;
        object-fit: cover;
        margin-bottom: 1rem;
        transition: opacity 500ms;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
</style>
