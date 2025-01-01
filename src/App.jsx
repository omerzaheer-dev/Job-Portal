import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./layout/AppLayout"
import Landing from "./pages/Landing"
import Onboarding from "./pages/Onboarding"
import JobListing from "./pages/JobListing"
import JobPage from "./pages/JobPage"
import PostJobs from "./pages/PostJobs"
import SavedJobs from "./pages/SavedJobs"
import { ThemeProvider } from "./components/theme-provider"
import ProtectedRoute from "./components/ProtectedRoute"
import Ibn from "./pages/Ibn"
import MyJobs from "./pages/MyJobs"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "/onboarding",
        element: <Onboarding />
      },
      {
        path: "/jobs",
        element: <ProtectedRoute><JobListing /></ProtectedRoute>
      },
      {
        path: "/ibn",
        element: <Ibn />
      },
      {
        path: "/job/:id",
        element: <ProtectedRoute><JobPage /></ProtectedRoute>
      },
      {
        path: "/post-job",
        element: <ProtectedRoute><PostJobs /></ProtectedRoute>
      },
      {
        path: "/saved-jobs",
        element: <ProtectedRoute><SavedJobs /></ProtectedRoute>
      },
      {
        path: "/my-jobs",
        element: <ProtectedRoute><MyJobs /></ProtectedRoute>
      },
    ]
  }
])
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
