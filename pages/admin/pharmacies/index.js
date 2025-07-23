import React from "react";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import PharmacyManagement from "../../../components/admin/PharmacyManagement";

const AdminPharmaciesPage = () => {
  return (
    <>
      <Head>
        <title>Manage Pharmacies - Admin</title>
        <meta
          name="description"
          content="Manage pharmacies in the healthcare system"
        />
      </Head>

      <AdminLayout title="Manage Pharmacies">
        <PharmacyManagement />
      </AdminLayout>
    </>
  );
};

export default AdminPharmaciesPage;
