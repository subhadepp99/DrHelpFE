import React from "react";
import Head from "next/head";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login - HealthCare</title>
        <meta name="description" content="Sign in to your HealthCare account" />
      </Head>
      <LoginForm />
    </>
  );
};

export default LoginPage;
