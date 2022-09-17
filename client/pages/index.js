import buildClient from '../api/build-client';
import catchAsync from '../utils/catchAsync';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>signedin</h1> : <h1>signedout</h1>;
};

LandingPage.getInitialProps = async (ctx) => {
  console.log('The Landing page');

  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
