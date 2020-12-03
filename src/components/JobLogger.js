import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box } from './publiq-ui/Box';
import { Inline } from './publiq-ui/Inline';
import { Stack } from './publiq-ui/Stack';
import { Title } from './publiq-ui/Title';
import { Button, ButtonVariants } from './publiq-ui/Button';
import { Icon, Icons } from './publiq-ui/Icon';

const JobTitle = ({ children, className, ...props }) => (
  <Title
    css={`
      font-size: 1rem;
      text-transform: uppercase;
      border-bottom: black 1px solid;
    `}
    className={className}
    {...props}
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
      width={{ default: 'calc(100% - 230px)', s: 'calc(100% - 65px)' }}
      left={{ default: '230px', s: '65px' }}
      backgroundColor="white"
      position="absolute"
    >
      <Stack padding={3} width={320} height="100vh">
        <Inline as="div" justifyContent="flex-end">
          <Button variant={ButtonVariants.UNSTYLED} onClick={onClose}>
            <Icon name={Icons.TIMES} opacity={{ default: 0.5, hover: 1 }} />
          </Button>
        </Inline>
        <Stack spacing={4}>
          {jobLoggerMenus.map((jobLoggerMenu) => (
            <JobTitle key={jobLoggerMenu.title}>{jobLoggerMenu.title}</JobTitle>
          ))}
        </Stack>
      </Stack>
      <Box
        backgroundColor="black"
        height="100vh"
        width="calc(100% - 320px)"
        opacity={0.5}
      />
    </Inline>
  );
};

JobLogger.propTypes = {
  onClose: PropTypes.func,
};

export { JobLogger };
