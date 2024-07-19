import React, { useState } from 'react';

const TodoListInput = ({ onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ title });
    setTitle('');
  };

  return (
    <form className="d-flex mb-4" onSubmit={handleSubmit}>
      <input
        type="text"
        id="title"
        className="form-control rounded-end-0"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary rounded-start-0">Add</button>
    </form>
  );
};

export default TodoListInput;
