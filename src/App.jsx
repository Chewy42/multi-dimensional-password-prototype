import './App.css';
import {
  BrowserRouter as Router,
  //Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Homepage from './Components/Homepage';
import SignInP1 from './Components/SignInP1';
import SignUpP1 from './Components/SignUpP1';
import SignInP2 from './Components/SignInP2';
import SignUpP2 from './Components/SignUpP2';

function App() {

  // FOR AUTHENTICATION AND PUBLIC/PRIVATE ROUTES
  // const { isAuthenticated } = useContext(AuthContext);

  // const PublicRoute = ({ element }) => {
  //   return !isAuthenticated ? element : <Navigate to="/dashboard" replace />;
  // };

  // const PrivateRoute = ({ element }) => {
  //   return isAuthenticated ? element : <Navigate to="/signin" replace />;
  // };

  return (
      <>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin-p1" element={<SignInP1 />} />
        <Route path="/signup-p1" element={<SignUpP1 />} />
        <Route path="/signin-p2" element={<SignInP2 />} />
        <Route path="/signup-p2" element={<SignUpP2 />} />
      </Routes>
    </Router>
      </>
  );
}

export default App;
