import merge from 'lodash.merge';

import { mount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import $api from './api';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

export const mountWithEnvironment = (Component, options = {}) =>
  mount(
    Component,
    merge(
      {
        localVue,
        mocks: {
          $t: (message) => message,
          $api,
          $i18n: {
            locale: 'nl',
          },
        },
        stubs: {
          NuxtLink: true,
          fa: true,
        },
      },
      options,
    ),
  );
