import { useEffect, useRef } from 'react';
import { detailedDiff } from 'deep-object-diff';
import pick from 'lodash/pick';

const diff = (oldValue, newValue) => {
  const { added = {}, deleted = {}, updated = {} } = detailedDiff(
    oldValue,
    newValue,
  );
  return pick(newValue, Object.keys({ ...deleted, ...added, ...updated }));
};

const useLog = (
  variables,
  { rawData = false, showOnlyDifference = false } = {},
) => {
  const ref = useRef();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const toLog = showOnlyDifference ? diff(ref.current, variables) : variables;
    ref.current = variables;

    // eslint-disable-next-line no-console
    console.log(rawData ? toLog : JSON.stringify(toLog, undefined, 2));
  }, Object.values(variables));
};

export { useLog };
