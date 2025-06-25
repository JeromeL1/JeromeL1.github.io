import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // State management
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Set loading state
                setLoading(true);
                setError(null);

                // Fetch data from the server
                const response = await fetch('http://localhost:5002/api');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                setError(error.message || 'Failed to fetch data from the server');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <div className="App-header">
                <h1>Learning MERN Application</h1>
                {loading && (
                    <div className="loading">
                        Loading data from server...
                    </div>
                )}
                {error && (
                    <div className="error-message" style={{ color: 'red' }}>
                        Error: {error}
                    </div>
                )}
                {message && (
                    <div className="welcome-message">
                        Server says: "{message}"
                    </div>
                )}
            </div>
        </div>
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