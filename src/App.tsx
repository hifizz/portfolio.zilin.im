import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from '@/components/layout'
import { Home } from '@/pages/home'
import { ProjectPage } from '@/pages/project'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/projects/:slug', element: <ProjectPage /> },
      { path: '*', element: <Home /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
