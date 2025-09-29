import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./Pages/OldLogin/LoginPage";
import RegisterPage from "./Pages/OldLogin/RegisterPage";
import ForgotPasswordPage from "./Pages/OldLogin/ForgotPasswordPage";
import HomePage from "./Pages/HomePage";
import DiscoverEvents from "./Pages/User/DiscoverEvents";
import CreateEvent from "./Pages/EventPlanner/CreateEvents";
import UserProfile from "./Pages/UserProfile";
import Help from "./Pages/Help";
import ResetPasswordPage from "./Pages/OldLogin/ResetPasswordPage";
import EventDetails from "./Pages/User/EventDetails";
import PlannerEventDetails from "./Pages/PlannerLandingPage/PlannerEventDetails";
import Checkout from "./Pages/User/Checkout";
import { TicketContextProvider } from "./TicketContext";
import PlannerRegister from "./Pages/OldLogin/PlannerRegister";
import SignUpOptions from "./Pages/NewLogin/SignUpOptions";
import HomePage2 from "./Pages/UserLandingPage/HomePage2";
import SignInPage from "./Pages/NewLogin/SignIn";
import SignUpPage from "./Pages/NewLogin/signup";
import TicketingDetails from "./Pages/EventPlanner/TicketingDetails";
import EventSuccess from "./Pages/EventPlanner/EventSucess";
import ManageEvents from "./Pages/EventPlanner/ManageEvents";
import PlannerHomePage from "./Pages/PlannerLandingPage/PlannerHomePage";
import CompleteProfile from "./Pages/NewLogin/CompleteProfile";
import VerifyEmail from "./Pages/OldLogin/verifyEmail";
import AdminProfile from "./Pages/AdminProfile";
import AdminHome from "./Pages/AdminHome";
import ManageClients from "./Pages/ManageClients";
import ManagePlanners from "./Pages/ManagePlanners";
import SuperAdminManageEvents from "./Pages/SuperAdminManageEvents";



function App() {
  return (
    <TicketContextProvider>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/eventPlanner" element={<PlannerHomePage />} />
        <Route path="/" element={<HomePage2 />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/discoverEvents" element={<DiscoverEvents />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user_register" element={<RegisterPage />} />
        <Route path="/planner_register" element={<PlannerRegister />} />
        <Route path="/sign_up_options" element={<SignUpOptions />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/createEvents" element={<CreateEvent />} />
        <Route path="/ticketingDetails" element={<TicketingDetails />} />
        <Route path="/eventSuccess" element={<EventSuccess />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/eventDetails/:eventId" element={<EventDetails />} />
        <Route path="/plannerEventDetails/:eventId" element={<PlannerEventDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/manageEvents" element={<ManageEvents />} />
        <Route path="/adminProfile" element={<AdminProfile />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/clients" element={<ManageClients />} />
        <Route path="/admin/planners" element={<ManagePlanners />} />
        <Route path="/admin/events" element={<SuperAdminManageEvents />} />
      </Routes>
    </TicketContextProvider>
  );
}

export default App;
