import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mail from "./Mail";
import Login from "./Login";
import Employee from "./Employee";
import Attendance from "./Attendance";
import HRRegister from "./Hr";
import AdminDashboard from "./Admin";
import AdminLogin from "./Adminlogin";
import Payroll from "./Payroll";
export default function App() {
  return (
  
      <Routes>
        <Route path="/mail" element={<Mail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/HrRegister" element={<HRRegister />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/" element={<AdminLogin/>}/>
         <Route path="payroll" element={<Payroll/>}/>

      </Routes>
  
  );
}
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Mail from "./Mail";
// import Login from "./Login";
// import Employee from "./Employee";
// import Attendance from "./Attendance";
// import HRRegister from "./Hr";
// import AdminDashboard from "./Admin";
// import AdminLogin from "./Adminlogin";
// import ProtectedRoute from "./ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/mail" element={<Mail />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/employee" element={<Employee />} />
//         <Route path="/attendance" element={<Attendance />} />
//         <Route path="/HrRegister" element={<HRRegister />} />

//         {/* Admin Login */}
//         <Route path="/" element={<AdminLogin />} />

//         {/* Protected Admin Dashboard */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }
