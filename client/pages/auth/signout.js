import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/request';

const SignOut = () => {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h1>Signing out.</h1>
      {errors}
    </div>
  );
};

export default SignOut;
