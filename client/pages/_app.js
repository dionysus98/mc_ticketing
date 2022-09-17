import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
import catchAsync from '../utils/catchAsync';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appCtx) => {
  const client = buildClient(appCtx.ctx);
  const { data } = await client.get('/api/users/currentuser');

  const pageProps = await catchAsync(() => {
    if (appCtx.Component.getInitialProps) {
      appCtx.Component.getInitialProps(appCtx.ctx);
    }
  });

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
