import buildClient from '../api/build-client';
import catchAsync from '../utils/catchAsync';

const LandingPage = ({ currentUser }) => {
  return (
    <>
      <h1>{currentUser.email || 'signOut'}</h1>
    </>
  );
};

LandingPage.getInitialProps = async (ctx) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser');
  console.log(data);
  return data;
};

export default LandingPage;
