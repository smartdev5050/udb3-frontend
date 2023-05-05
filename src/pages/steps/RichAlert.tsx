import { Alert, AlertProps } from '@/ui/Alert';
import { Box, parseSpacing } from '@/ui/Box';
import { getInlineProps } from '@/ui/Inline';
import { ReactNode } from 'react';

const RichAlert = ({
  children,
  ...props
}: AlertProps & { children: string }) => (
  <Alert flex="1 0 auto" {...getInlineProps(props)}>
    <Box
      forwardedAs="div"
      dangerouslySetInnerHTML={{ __html: children }}
      css={`
        strong {
          font-weight: bold;
        }

        ul {
          list-style-type: disc;
          margin-bottom: ${parseSpacing(4)};

          li {
            margin-left: ${parseSpacing(5)};
          }
        }
      `}
    />
  </Alert>
);

export { RichAlert };
