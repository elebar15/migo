// Import necessary components and functions from react-router-dom.
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Navigate,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Register } from "./pages/Register";
import Login from "./pages/Login";
import { RecoveryPassword } from "./pages/RecoveryPassword"
import { AddPet } from "./pages/AddPet";
import { PetDetail } from "./pages/PetDetail";
import { EditPet } from "./pages/EditPet";
import NotFound from "./pages/NotFound";
import { AddNote } from "./pages/AddNote";
import { EditNote } from "./pages/EditNote"
import { Chatbot } from "./pages/Chatbot";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<NotFound/>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}

        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Login />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path= "/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} /> 
        <Route path= "/pet-detail/:theId" element={<ProtectedRoute><PetDetail/></ProtectedRoute>}/>
        <Route path="/edit-pet/:id" element={<EditPet />} />
        <Route path="/add-note" element={<ProtectedRoute><AddNote /></ProtectedRoute>} /> 
        <Route path="/edit-note/:id" element={<ProtectedRoute><EditNote /></ProtectedRoute>} /> 
        <Route path="/consejos" element={<Chatbot />} />
      </Route>
    )
);