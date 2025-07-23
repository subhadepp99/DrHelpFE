import React from "react";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import ClinicManagement from "../../../components/admin/ClinicManagement";

const AdminClinicsPage = () => {
  return (
    <>
      <Head>
        <title>Manage Clinics - Admin</title>
        <meta
          name="description"
          content="Manage clinics in the healthcare system"
        />
      </Head>

      <AdminLayout title="Manage Clinics">
        <ClinicManagement />
      </AdminLayout>
    </>
  );
};

export default AdminClinicsPage;
