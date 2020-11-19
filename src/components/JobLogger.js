import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box } from './publiq-ui/Box';
import { Inline } from './publiq-ui/Inline';
import { Stack } from './publiq-ui/Stack';
import { Title } from './publiq-ui/Title';

const JobTitle = ({ children, className }) => (
  <Title
    css={`
      width: 100%;
      font-size: 1rem;
      text-transform: uppercase;
      border-bottom: black 1px solid;
    `}
    className={className}
  >
    {children}
  </Title>
);

JobTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const JobLogger = () => {
  const { t } = useTranslation();

  const jobLoggerItems = [
    {
      title: t('jobs.exported_documents'),
      items: [],
    },
    {
      title: t('jobs.notifications'),
      items: [],
    },
    {
      title: t('jobs.in_progress'),
      items: [],
    },
  ];

  return (
    <Inline
      css={`
        width: 100%;
        position: absolute;
        left: 230px;
        background-color: white;
      `}
    >
      <Stack
        padding={3}
        spacing={4}
        css={`
          width: 320px;
          height: 100vh;
        `}
      >
        {jobLoggerItems.map((jobLoggerItem) => (
          <JobTitle key={jobLoggerItem.title}>{jobLoggerItem.title}</JobTitle>
        ))}
      </Stack>
      <Box
        css={`
          background-color: black;
          opacity: 0.5;
          height: 100vh;
          width: calc(100% - 320px);
        `}
      />
    </Inline>
  );
};

export { JobLogger };
