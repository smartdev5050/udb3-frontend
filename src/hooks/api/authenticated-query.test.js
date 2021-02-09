import { getStatusFromResults, QueryStatus } from './authenticated-query';

describe('getStatusFromResults', () => {
  it('returns error when one result is errror', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.SUCCESS },
      { status: QueryStatus.ERROR, error: 'this is an error' },
      { status: QueryStatus.ERROR, error: 'this is another error' },
      { status: QueryStatus.SUCCESS },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.ERROR,
      error: ['this is an error', 'this is another error'],
    });
  });

  it('returns success when every result is a success', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.SUCCESS },
      { status: QueryStatus.SUCCESS },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.SUCCESS,
    });
  });

  it('returns idle when one results is idle', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.SUCCESS },
      { status: QueryStatus.IDLE },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.IDLE,
    });
  });

  it('returns idle when one results is loading', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.IDLE },
      { status: QueryStatus.LOADING },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.LOADING,
    });
  });
});
