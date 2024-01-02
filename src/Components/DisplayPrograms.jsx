// DisplayPrograms.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/DisplayPrograms.css';

const DisplayPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [editProgram, setEditProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrograms();
  }, []);

  const deleteProgram = async (programId) => {
    try {
      await axios.delete(`http://localhost:3000/programs/${programId}`);
      setPrograms(programs.filter(program => program._id !== programId));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEditMode = (program) => {
    setEditProgram(editProgram === program ? null : program);
  };

  const saveChanges = async (programId, updatedProgram) => {
    try {
      await axios.put(`http://localhost:3000/programs/${programId}`, updatedProgram);
      setPrograms(programs.map(program => program._id === programId ? updatedProgram : program));
      setEditProgram(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour : ", error);
    }
  };

  return (
    <div className="programs-container">
      {programs.map(program => (
        <div key={program._id} className="program-card">
          {editProgram === program ? (
            <EditProgramForm 
              program={program} 
              onSave={(updatedProgram) => saveChanges(program._id, updatedProgram)}
              onCancel={() => toggleEditMode(null)}
            />
          ) : (
            <div>
              <h3 className="program-title">{program.programTitle}</h3>
              {program.courses.map((course, index) => (
                <div key={index} className="course-container">
                  <h4 className="course-title">{course.title}</h4>
                  {course.lessons.map((lesson, lessonIndex) => (
                    <p key={lessonIndex} className="lesson">
                      {lesson.title} - Vimeo ID: {lesson.vimeoId}
                      <br/>
                      {lesson.text}
                    </p>
                  ))}
                </div>
              ))}
              <button onClick={() => toggleEditMode(program)} className="edit-btn">Modifier</button>
              <button onClick={() => deleteProgram(program._id)} className="delete-btn">Supprimer</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const EditProgramForm = ({ program, onSave, onCancel }) => {
  const [programData, setProgramData] = useState(program);

  const handleProgramDataChange = (e) => {
    setProgramData({ ...programData, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (courseIndex, key, value) => {
    const updatedCourses = [...programData.courses];
    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [key]: value };
    setProgramData({ ...programData, courses: updatedCourses });
  };

  const handleLessonChange = (courseIndex, lessonIndex, key, value) => {
    const updatedCourses = [...programData.courses];
    const updatedLessons = [...updatedCourses[courseIndex].lessons];
    updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], [key]: value };
    updatedCourses[courseIndex].lessons = updatedLessons;
    setProgramData({ ...programData, courses: updatedCourses });
  };

  const addNewCourse = () => {
    setProgramData({ ...programData, courses: [...programData.courses, { title: '', lessons: [] }] });
  };

  const removeCourse = (courseIndex) => {
    const updatedCourses = programData.courses.filter((_, index) => index !== courseIndex);
    setProgramData({ ...programData, courses: updatedCourses });
  };

  const addNewLesson = (courseIndex) => {
    const newLesson = { title: '', vimeoId: '', text: '' };
    const updatedCourses = [...programData.courses];
    updatedCourses[courseIndex].lessons.push(newLesson);
    setProgramData({ ...programData, courses: updatedCourses });
  };

  const removeLesson = (courseIndex, lessonIndex) => {
    const updatedCourses = [...programData.courses];
    updatedCourses[courseIndex].lessons = updatedCourses[courseIndex].lessons.filter((_, index) => index !== lessonIndex);
    setProgramData({ ...programData, courses: updatedCourses });
  };

  return (
    <div className="edit-program-form">
      <input
        type="text"
        name="programTitle"
        placeholder='Titre du programme'
        value={programData.programTitle}
        onChange={handleProgramDataChange}
      />
      {programData.courses.map((course, courseIndex) => (
        <div key={courseIndex} className="edit-course">
          <input
            type="text"
            placeholder='Titre du module'
            value={course.title}
            onChange={(e) => handleCourseChange(courseIndex, 'title', e.target.value)}
          />
          {course.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="edit-lesson">
              <input
                type="text"
                placeholder='Titre de la leçon'
                value={lesson.title}
                onChange={(e) => handleLessonChange(courseIndex, lessonIndex, 'title', e.target.value)}
              />
              <input
                type="text"
                placeholder='Vimeo ID'
                value={lesson.vimeoId}
                onChange={(e) => handleLessonChange(courseIndex, lessonIndex, 'vimeoId', e.target.value)}
              />
              <textarea
                value={lesson.text}
                placeholder='Texte de la leçon'
                onChange={(e) => handleLessonChange(courseIndex, lessonIndex, 'text', e.target.value)}
              />
              <button onClick={() => removeLesson(courseIndex, lessonIndex)}>Supprimer Leçon</button>
            </div>
          ))}
          <button onClick={() => addNewLesson(courseIndex)}>Ajouter Leçon</button>
          <button onClick={() => removeCourse(courseIndex)}>Supprimer Module</button>
        </div>
      ))}
      <button onClick={addNewCourse}>Ajouter Module</button>
      <button onClick={() => onSave(programData)}>Sauvegarder</button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  );
};

export default DisplayPrograms;
