import events from './data/events';
import projects from './data/projects';

const findById = (id) => events.find((event) => event['@id'].endsWith(id));

export default {
  productions: {
    find: ({ name = '' } = {}) => {
      if (!name) {
        return {
          member: projects,
          totalItems: projects.length,
        };
      }

      const foundProjects = projects.filter((project) => project.name === name);

      return {
        member: foundProjects,
        totalItems: foundProjects.length,
      };
    },
  },
  events: {
    getCalendarSummary: () => 'MOCKED CALENDAR SUMMARY',
    findById,
    findByIds: (ids) => ids.map((id) => findById(id)),
  },
};
