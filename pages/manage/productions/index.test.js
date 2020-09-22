import Index from './Index';
import Vue from 'vue';

import { mountWithEnvironment } from '../../../test/mountWithEnvironment';

test('returns full list when entering the page', async () => {
  const wrapper = mountWithEnvironment(Index);

  await Vue.nextTick();

  const listItems = wrapper.findAll('.productions .list-group-item');
  expect(listItems).toHaveLength(2);
});
test('returns a found item when searching with an existing production name', async () => {
  const wrapper = mountWithEnvironment(Index);

  const searchInput = wrapper.find('#productions-overview-search');

  await searchInput.setValue('Testing');
  await Vue.nextTick();

  const listItems = wrapper.findAll('.productions .list-group-item');
  expect(listItems).toHaveLength(1);
});
test('returns no results when searching a wrong production name', async () => {
  const wrapper = mountWithEnvironment(Index);

  const searchInput = wrapper.find('#productions-overview-search');

  await searchInput.setValue('test');
  await Vue.nextTick();

  const productionsContainer = wrapper.find('.productions-events-container');

  const listItems = wrapper.findAll('.productions .list-group-item');
  expect(listItems).toHaveLength(0);

  expect(productionsContainer.text()).toContain(
    'productions.overview.no_productions',
  );
});

test('Enable remove button when selecting event', async () => {
  const wrapper = mountWithEnvironment(Index);

  await Vue.nextTick();
  await Vue.nextTick();

  const removeButton = wrapper.find('.events-container .btn-danger').element;
  expect(removeButton).toBeDisabled();

  const checkbox = wrapper.find('.event-item .container-checkbox input');
  await checkbox.trigger('click');

  expect(removeButton).toBeEnabled();
});
