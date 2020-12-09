import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { Inline } from './Inline';
import { Box, parseSpacing } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('detailTable');

const DetailTable = ({ items, className, ...props }) => {
  return (
    <Stack
      as="table"
      backgroundColor={getValue('backgroundColor')}
      className={className}
      {...getStackProps(props)}
    >
      {items.map(({ header, value }, index) => (
        <Inline
          key={index}
          forwardedAs="tr"
          padding={3}
          css={
            index !== items.length - 1
              ? (props) => {
                  return `border-bottom: 1px solid ${getValue('borderColor')(
                    props,
                  )};`;
                }
              : undefined
          }
        >
          <Box
            forwardedAs="th"
            minWidth={parseSpacing(7)()}
            css="font-weight: bold;"
          >
            {header}
          </Box>
          <Box as="td">{value}</Box>
        </Inline>
      ))}
    </Stack>
  );
};

DetailTable.propTypes = {
  ...stackPropTypes,
  items: PropTypes.arrayOf(
    PropTypes.shape({ header: PropTypes.string, value: PropTypes.string }),
  ),
  className: PropTypes.string,
};

DetailTable.defaultProps = {
  items: [],
};

export { DetailTable };
