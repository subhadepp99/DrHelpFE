import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import DoctorManagement from "../../../components/admin/DoctorManagement";

const AdminDoctorsPage = () => {
  return (
    <>
      <Head>
        <title>Manage Doctors - Admin</title>
        <meta
          name="description"
          content="Manage doctors in the healthcare system"
        />
      </Head>

      <AdminLayout title="Manage Doctors">
        <DoctorManagement />
      </AdminLayout>
    </>
  );
};

export default AdminDoctorsPage;
