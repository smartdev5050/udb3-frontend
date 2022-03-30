import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { MovieForm } from './MovieForm';

export const getServerSideProps = getApplicationServerSideProps();

const WrappedMovieForm = (props: unknown) => (
  <MovieForm {...props} key="create" />
);

export default WrappedMovieForm;
