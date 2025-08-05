import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import GuestRoute from '../routes/GuestRoute';
import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';
import CreateClient from '../components/user/createClient';
import ListClients from '../components/user/listClients';
import ListInvoicesByClient from '../components/invoice/listInvoicesByClient';
import UpdateClient from '../components/user/updateClient';
import ClientStats from '../views/dashboard/DashSales/indexClient';

// Lazy-loaded components
const DashboardSales = lazy(() => import('../views/dashboard/DashSales/index'));
const AuthLogin = lazy(() => import('../views/auth/login'));
const AuthRegister = lazy(() => import('../views/auth/register'));
const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));
const Color = lazy(() => import('../views/ui-elements/basic/BasicColor'));
const FeatherIcon = lazy(() => import('../views/ui-elements/icons/Feather'));
const FontAwesome = lazy(() => import('../views/ui-elements/icons/FontAwesome'));
const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));
const Sample = lazy(() => import('../views/sample'));
const ListInvoices = lazy(() => import('../components/invoice/listInvoices'));
const AddInvoice = lazy(() => import('../components/invoice/addInvoice'));
const UpdateInvoice = lazy(() => import('../components/invoice/updateInvoice'));
const InvoiceDetails = lazy(() => import('../components/invoice/invoiceDetails'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/" replace />
          },
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardSales />
              </Suspense>
            )
          },
          {
            path: 'dashboard/client',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ClientStats />
              </Suspense>
            )
          },
          {
            path: 'typography',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Typography />
              </Suspense>
            )
          },
          {
            path: 'color',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Color />
              </Suspense>
            )
          },
          {
            path: 'icons/Feather',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <FeatherIcon />
              </Suspense>
            )
          },
          {
            path: 'icons/font-awesome-5',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <FontAwesome />
              </Suspense>
            )
          },
          {
            path: 'icons/material',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <MaterialIcon />
              </Suspense>
            )
          },
          {
            path: 'sample-page',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Sample />
              </Suspense>
            )
          },
          {
            path: 'invoices',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ListInvoices />
              </Suspense>
            )
          },
          {
            path: 'user/add',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                < CreateClient />
              </Suspense>
            )
          },
          {
            path: 'users/',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                < ListClients />
              </Suspense>
            )
          },
          {
            path: 'invoices/add',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AddInvoice />
              </Suspense>
            )
          },
          {
            path: 'invoice/edit/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <UpdateInvoice />
              </Suspense>
            )
          },
          {
            path: 'invoices/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <InvoiceDetails />
              </Suspense>
            )
          },
          {
            path: 'invoices/client/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ListInvoicesByClient />
              </Suspense>
            )
          },
          {
            path: 'user/edit/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <UpdateClient />
              </Suspense>
            )
          },
          {
            path: '*',
            element: <h1>Not Found</h1>
          }
        ]
      }
    ]
  },
  {
    path: '/',
    element: <GuestRoute />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          {
            path: 'login',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AuthLogin />
              </Suspense>
            )
          },
          {
            path: 'register',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AuthRegister />
              </Suspense>
            )
          }
        ]
      }
    ]
  }
], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
