import React from "react";
import Head from "next/head";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <Head>
        <title>Register - HealthCare</title>
        <meta name="description" content="Create your HealthCare account" />
      </Head>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
