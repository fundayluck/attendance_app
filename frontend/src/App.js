import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import PrivateRoutes from "./components/PrivateRoutes";
import Attendance from "./pages/Attendance";
import Dashboard from './pages/Dashboard'
import Layout from "./components/Layout";
import People from "./pages/People";
import Request from "./pages/Request";
import Access from "./pages/Access";
import AddStaff from "./components/people/AddStaff";
import useAuth from "./ahooks/useAuth";
import ListNipWithoutAccount from "./components/people/ListNipWithoutAccount";
import AddUser from "./components/people/AddUser";
import DetailStaff from "./components/people/DetailStaff";
import EditStaff from "./components/people/EditStaff";
import DetailUser from "./components/user/DetailUser";
import EditUser from "./components/user/EditUser";
import Config from "./pages/Config";
import DetailAttendance from "./components/attendance/DetailAttendance";
import ForgotPassword from "./pages/ForgotPassword";
import DetailAccess from "./components/request/DetailAccess";
import Report from "./components/attendance/Report";

function App() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={auth?.status ? '/dashboard' : '/login'} />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path={auth?.status === true ? "/" : '/login'}
        element={auth?.status === true ? <Layout /> : <Login />}
      />
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detail-user" element={<DetailUser />} />
          <Route path="/detail-user/edit/:id" element={<EditUser />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/:id" element={<DetailAttendance />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:id" element={<DetailStaff />} />
          <Route path="/people/:id/edit" element={<EditStaff />} />
          <Route path="/people/list-nip" element={<ListNipWithoutAccount />} />
          <Route path="/people/list-nip/create/:id" element={<AddUser />} />
          <Route path="/people/add-employee" element={<AddStaff />} />
          <Route path="/request" element={<Request />} />
          <Route path="/access" element={<Access />} />
          <Route path="/access/:id" element={<DetailAccess />} />
          <Route path="/config" element={<Config />} />
        </Route>
        <Route path="/report/:date" element={<Report />} />
      </Route>
    </Routes >
  );
}

export default App;
