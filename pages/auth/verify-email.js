import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import EmailVerification from "../../components/auth/EmailVerification";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid verification link</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Verify Email - HealthCare</title>
        <meta name="description" content="Verify your email address" />
      </Head>
      <EmailVerification userId={userId} />
    </>
  );
};

export default VerifyEmailPage;
