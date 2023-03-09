import { Card as BootstrapCard } from 'react-bootstrap';

import { getStackProps, Stack, StackProps } from './Stack';

type CardProps = StackProps;

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <BootstrapCard
      forwardedAs={Stack}
      className={className}
      {...getStackProps(props)}
      css={`
        &.card {
          border: none;
        }
      `}
    >
      {children}
    </BootstrapCard>
  );
};

export { Card };
