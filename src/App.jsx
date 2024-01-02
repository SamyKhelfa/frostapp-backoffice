// App.jsx

import React from 'react';
import AddCourseForm from './Components/AddCourseForm';
import DisplayPrograms from './Components/DisplayPrograms';

const App = () => {
  return (
    <div>
      <h1>Bienvenue sur l'application</h1>
      <AddCourseForm />
      <DisplayPrograms />
    </div>
  );
};

export default App;
