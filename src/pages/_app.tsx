import React from 'react';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/Layout';
import { useRouter } from 'next/router';


const App = ({ Component, pageProps }: AppProps) => {

  const router = useRouter()

  return router.pathname === "/login" ?
    (<Component {...pageProps} />) :
    (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
}

export default App;