// Import necessary dependencies
import React from 'react';
import CitiesTable from './CitiesTable';
import WeatherPage from './WeatherPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // If using React Router

// Define your App component
function App() {
  return (
    <Router> {/* Wrap your components with Router if using React Router */}
      <div>
        {/* Define routes */}
        <Switch>
          <Route path="/" exact component={CitiesTable} />
          <Route path="/weather/:cityName" component={WeatherPage} />
        </Switch>
      </div>
    </Router> 
  );
}

export default App;
