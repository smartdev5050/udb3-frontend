import events from './data/events';
import productions from './data/productions';

const findById = (id) => events.find((event) => event['@id'].endsWith(id));

export default {
  productions: {
    find: ({ name = '' } = {}) => {
      if (!name) {
        return {
          member: productions,
          totalItems: productions.length,
        };
      }

      const foundProductions = productions.filter(
        (project) => project.name === name,
      );

      return {
        member: foundProductions,
        totalItems: foundProductions.length,
      };
    },
  },
  events: {
    getCalendarSummary: () => 'MOCKED CALENDAR SUMMARY',
    findById,
    findByIds: (ids) => ids.map((id) => findById(id)),
  },
};
