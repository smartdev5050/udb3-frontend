import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box } from './publiq-ui/Box';
import { Inline } from './publiq-ui/Inline';
import { Stack } from './publiq-ui/Stack';
import { Title } from './publiq-ui/Title';
import { Button, ButtonVariants } from './publiq-ui/Button';
import { Icon, Icons } from './publiq-ui/Icon';

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

const JobLogger = ({ onClose }) => {
  const { t } = useTranslation();

  const jobLoggerMenus = [
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
        width: calc(100% - 230px);
        position: absolute;
        left: 230px;
        background-color: white;
      `}
    >
      <Stack
        padding={3}
        css={`
          width: 320px;
          height: 100vh;
        `}
      >
        <Inline as="div" justifyContent="flex-end">
          <Button variant={ButtonVariants.UNSTYLED} onClick={onClose}>
            <Icon
              name={Icons.TIMES}
              css={`
                opacity: 0.5;
                &:hover {
                  opacity: 1;
                }
              `}
            />
          </Button>
        </Inline>
        <Stack spacing={4}>
          {jobLoggerMenus.map((jobLoggerMenu) => (
            <JobTitle key={jobLoggerMenu.title}>{jobLoggerMenu.title}</JobTitle>
          ))}
        </Stack>
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

JobLogger.propTypes = {
  onClose: PropTypes.func,
};

export { JobLogger };
