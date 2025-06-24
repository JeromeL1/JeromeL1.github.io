import React, { useState, useEffect } from 'react';
import './App.css';

function App() 
    {
        // State to manage the welcome message
        // Group with other states for better organization

        // state to store the message from the server
        const [message, setMessage] = useState(null);
        // State to manage loading state
        const [loading, setLoading] = useState(true);
        // State to handle error messages
        const [error, setError] = useState(null);

        // useEffect to simulate loading and fetching data from the server
        // This will run once when the component mounts, thanks to the empty dependency array
        useEffect(() => 
            {
            const fetchData = async ()  => 
                {
                try
                    {
                    // Fetch data from the server
                    const response = await fetch('/api');
                    if (!response.ok) 
                        {
                        throw new Error('Network response was not ok');
                        }

                    const data = await response.json();
                    setMessage(data.message);
                    } catch (error) { 
                        setError('Failed to fetch data from the server');
                        console.error('Error fetching data:', error);
                    } finally {
                        setLoading(false); // Set loading to false after fetching data (success or failure)
                    }
                fetchData();
                };
        fetchData();
            }, []);

        return (
            <div className='App'>
                <div className='App-header'>
                    <h1>Learning MERN Application</h1>
                    {loading && <div className='loading'>Loading data from server...</div>}
                    {error && <div className='error-message'>Error: {error}</div>}
                    {message && <div className='welcome-message'>Server says: "{message}"</div>}
                    </div>
            </div>
        )
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