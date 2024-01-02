import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/AddCourseForm.css';

const BackOffice = () => {
  const [programTitle, setProgramTitle] = useState('');
  const [modules, setModules] = useState([{ title: '', lessons: [] }]);

  const handleModuleChange = (index, event) => {
    const newModules = [...modules];
    newModules[index].title = event.target.value;
    setModules(newModules);
  };

  const addModule = () => {
    setModules([...modules, { title: '', lessons: [] }]);
  };

  const removeModule = (index) => {
    const newModules = modules.filter((_, moduleIndex) => moduleIndex !== index);
    setModules(newModules);
  };

  const handleLessonChange = (moduleIndex, lessonIndex, key, value) => {
    const updatedModules = [...modules];
    if (!updatedModules[moduleIndex].lessons[lessonIndex]) {
      updatedModules[moduleIndex].lessons[lessonIndex] = { title: '', vimeoId: '', text: '' };
    }
    updatedModules[moduleIndex].lessons[lessonIndex][key] = value;
    setModules(updatedModules);
  };

  const addLessonToModule = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({ title: '', vimeoId: '', text: '' });
    setModules(updatedModules);
  };

  const removeLessonFromModule = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, idx) => idx !== lessonIndex
    );
    setModules(updatedModules);
  };

  const refreshPage = () => {
    window.location.reload();
  };
 
  const saveProgram = async () => {
    try {
      const dataToSend = { programTitle, courses: modules }; // Assurez-vous que cela correspond au schéma attendu
      const response = await axios.post('http://localhost:3000/programs', dataToSend);
      console.log("Réponse de l'API : ", response);
      setProgramTitle('');
      setModules([{ title: '', lessons: [] }]);
      refreshPage();
    } catch (error) {
      console.error("Erreur lors de l'envoi des données : ", error.response || error);
    }
  };

  return (
    <div className="backoffice-container">
      <h1 className="backoffice-title">BackOffice pour les formations</h1>

      <div className="input-group">
        <input
          className="input-field"
          type="text"
          value={programTitle}
          onChange={(e) => setProgramTitle(e.target.value)}
          placeholder="Titre de la formation"
        />
      </div>

      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex}>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              value={module.title}
              onChange={(e) => handleModuleChange(moduleIndex, e)}
              placeholder="Titre du module"
            />
            <button className="btn" onClick={() => removeModule(moduleIndex)}>Enlever Module</button>
          </div>

          {module.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="input-group">
              <input
                className="input-field"
                type="text"
                value={lesson.title}
                onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)}
                placeholder="Titre de la leçon"
              />
              <input
                className="input-field"
                type="text"
                value={lesson.vimeoId}
                onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'vimeoId', e.target.value)}
                placeholder="ID Vimeo de la leçon"
              />
              <textarea
                className="input-field"
                value={lesson.text}
                onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'text', e.target.value)}
                placeholder="Texte supplémentaire"
              />
              <button className="btn" onClick={() => removeLessonFromModule(moduleIndex, lessonIndex)}>Enlever Leçon</button>
            </div>
          ))}
          <button className="btn" onClick={() => addLessonToModule(moduleIndex)}>Ajouter Leçon</button>
        </div>
      ))}

      <button className="btn" onClick={addModule}>Ajouter Module</button>
      <button className="btn save-btn" onClick={saveProgram}>Sauvegarder Programme</button>
    </div>
  );
};

export default BackOffice;
