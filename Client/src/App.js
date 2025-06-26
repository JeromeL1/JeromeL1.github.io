import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Placeholder Home component - replace with your actual home component
const Home = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Welcome to the App</h1>
    <p>This is a protected page. You can only see this if you're logged in.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 


// function App() {
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         // Simulate loading data or authentication check
//         const timer = setTimeout(() => {
//         setLoading(false);
//         }, 1000); // Simulate a 1 second loading time
    
//         return () => clearTimeout(timer);
//     }, []);
    
//     if (loading) {
//         return <div className="loading">Loading...</div>;
//     }
    
//     return (
//         <AuthProvider>
//         <Router>
//             <Switch>
//             <Route path="/" exact component={Home} />
//             <Route path="/login" component={Login} />
//             <Route path="/register" component={Register} />
//             <PrivateRoute path="/dashboard" component={Dashboard} />
//             </Switch>
//         </Router>
//         </AuthProvider>
//     );