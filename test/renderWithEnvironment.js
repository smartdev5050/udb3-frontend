import merge from 'lodash.merge';

import { render } from '@testing-library/vue';
import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import $api from './api';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

export const renderWithEnvironment = (Component, options = {}) =>
  render(
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
