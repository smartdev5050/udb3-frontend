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
              { seen: isFeatureSeen(feature.uid) },
            ]"
            @click="showFeature(feature.uid)"
          >
            <div class="notification-icon-wrapper">
              <fa
                v-if="!isFeatureSeen(feature.uid)"
                icon="eye"
                class="eye-icon"
              />
              <fa v-else icon="eye-slash" class="eye-icon" />
            </div>
            <p>{{ feature.title }}</p>
          </div>
        </div>
        <div
          v-if="selectedFeature"
          :key="selectedFeature.uid"
          class="features-detail"
        >
          <h6>{{ selectedFeature.title }}</h6>
          <a
            v-if="selectedFeature.image"
            :href="selectedFeature.callToAction"
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
          <div class="flex-right">
            <a
              v-if="selectedFeature.callToAction"
              :href="selectedFeature.callToAction"
              target="_blank"
            >
              <b-button class="btn-call-to-action" variant="primary">
                {{ selectedFeature.callToActionLabel }}
              </b-button>
            </a>
          </div>
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
      seenFeatures: [],
      selectedFeature: undefined,
    }),
    computed: {
      cookieOptions() {
        return {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        };
      },
    },
    watch: {
      seenFeatures(newSeenFeatures) {
        this.$cookies.set('seenFeatures', newSeenFeatures, this.cookieOptions);
      },
    },
    created() {
      this.fetchFeatures().then((res) => {
        this.features = res;

        if (this.features.length === 0) {
          this.seenFeatures = [];
          return;
        }

        const seenFeaturesInCookie = this.$cookies.get('seenFeatures') || [];
        this.seenFeatures = seenFeaturesInCookie.filter((seenFeature) => {
          return this.features.find((feature) => feature.uid === seenFeature);
        });

        this.selectedFeature = this.features[0];
      });
    },
    methods: {
      async fetchFeatures() {
        this.loading = true;
        const response = await fetch(process.env.newFeaturesUrl);
        const { data } = await response.json();
        this.loading = false;
        return data;
      },
      addToSeenFeatures(uid) {
        if (!this.seenFeatures.includes(uid)) {
          this.seenFeatures.push(uid);
        }
      },
      isFeatureSeen(uid) {
        return this.seenFeatures.includes(uid);
      },
      showModal() {
        if (this.loading) {
          return;
        }

        if (this.selectedFeature) {
          this.addToSeenFeatures(this.selectedFeature.uid);
        }

        this.$refs['giftbox-modal'].show();
      },
      hideModal() {
        this.$refs['giftbox-modal'].hide();
      },
      showFeature(uid) {
        if (uid) {
          this.selectedFeature = this.features.find(
            (feature) => feature.uid === uid,
          );
          this.addToSeenFeatures(this.selectedFeature.uid);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
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
  .modal-open .modal {
    overflow-y: hidden;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-body {
    padding: 0;
  }

  .features-wrapper {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    border-top: $udb-grey 1px solid;

    .flex-right {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    .features-list {
      width: 30%;
      max-height: 88vh;
      border-right: $udb-grey 1px solid;
      overflow-y: scroll;

      .feature-title-block {
        border-bottom: $udb-grey 1px solid;
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
        }

        &.selected:hover {
          background-color: lighten($udb-primary-color, 40%);
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
      max-height: 88vh;
      padding: 1rem;
      overflow-y: scroll;

      h6 {
        font-weight: bold;
        vertical-align: middle;
      }

      .btn-call-to-action {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: fit-content;
        max-width: 100%;
        margin-bottom: 1rem;
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
