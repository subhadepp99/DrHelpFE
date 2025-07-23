import React from "react";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import PatientManagement from "../../../components/admin/PatientManagement";

const AdminPatientsPage = () => {
  return (
    <>
      <Head>
        <title>Manage Patients - Admin</title>
        <meta
          name="description"
          content="Manage patients in the healthcare system"
        />
      </Head>

      <AdminLayout title="Manage Patients">
        <PatientManagement />
      </AdminLayout>
    </>
  );
};

export default AdminPatientsPage;
