export const mutations = {
  SET_LANGUAGE(state, language) {
    state.language = language;
  },
};

export const state = () => ({
  language: 'nl',
});
