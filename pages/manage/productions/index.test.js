import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import Index from './Index';

import { renderWithEnvironment } from '../../../test/renderWithEnvironment';

beforeEach(() => {
  renderWithEnvironment(Index);
});

test('returns full list when entering the page', async () => {
  const productions = await screen.findByRole('list', {
    name: 'productions.overview.aria.productions',
  });

  expect(productions.childNodes).toHaveLength(2);

  const anotherOne = await screen.findByText('Another one');
  const testing = await screen.findByText('Testing');

  expect(anotherOne).toBeInTheDocument();
  expect(testing).toBeInTheDocument();
});

test('returns a found item when searching with an existing production name', async () => {
  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'Testing');

  const productions = await screen.findByRole('list', {
    name: 'productions.overview.aria.productions',
  });

  expect(productions.childNodes).toHaveLength(1);

  const testing = await screen.findByText('Testing');

  expect(testing).toBeInTheDocument();
});

test('returns no results when searching a wrong production name', async () => {
  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'random search');

  const noProductions = await screen.findByText(
    'productions.overview.no_productions',
  );

  expect(noProductions).toBeInTheDocument();
});

test('Enable remove button when selecting event', async () => {
  const checkbox = screen.getByRole('checkbox', { name: 'eee' });

  const removeButton = await screen.findByText('productions.overview.delete');

  expect(removeButton).toBeDisabled();

  await userEvent.click(checkbox);

  expect(removeButton).toBeEnabled();
});
