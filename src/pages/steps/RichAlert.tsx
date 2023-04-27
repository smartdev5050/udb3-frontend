import { Alert } from '@/ui/Alert';
import { Box, parseSpacing } from '@/ui/Box';

function RichAlert({ children, ...props }) {
  return (
    <Alert flex="1 0 auto" {...props}>
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
}

export { RichAlert };
