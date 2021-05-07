import PropTypes from 'prop-types';

import { Box, parseSpacing } from './Box';
import { Inline } from './Inline';
import { getStackProps, Stack } from './Stack';
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
      <Stack as="tbody">
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
            <Box as="th" minWidth={parseSpacing(7)()} fontWeight="bold">
              {header}
            </Box>
            <Box as="td">{value}</Box>
          </Inline>
        ))}
      </Stack>
    </Stack>
  );
};

DetailTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ header: PropTypes.string, value: PropTypes.string }),
  ),
  className: PropTypes.string,
};

DetailTable.defaultProps = {
  items: [],
};

export { DetailTable };
