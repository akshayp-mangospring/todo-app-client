import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodoListItem, deleteTodoList, deleteTodoListFromState } from "@store/todoListsSlice";
import { isEnterKeyPressed } from "@utils";
import Trash from '@icons/Trash';
import Todo from "@app_components/Todo";

const TodoList = ({ list: { id, title, todoListItems: todos } }) => {
  const todoListDomId = `todo_list_${id}`;
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addTodo = (e) => {
    if (isEnterKeyPressed(e)) {
      dispatch(createTodoListItem({ listId: id, content: inputValue }));
      setInputValue('');
    }
  };

  const deleteList = async (e) => {
    e.stopPropagation();
    await dispatch(deleteTodoList(id));
    dispatch(deleteTodoListFromState(id));
  };

  return (
    <div className="col col-xs-12 col-sm-12 col-md-6 col-lg-4 accordion">
      <div className="accordion-item">
        <h2 className="accordion-header position-relative" onClick={() => setIsCollapsed(!isCollapsed)}>
          <button
            className={`accordion-button ${isCollapsed ? 'collapsed' : ''}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${todoListDomId}`}
            aria-expanded={!isCollapsed}
            aria-controls={todoListDomId}
          >
            {title}
          </button>
          <span role="button"
            className="align-items-center position-absolute delete-todo-list"
            onClick={deleteList}
          >
            <Trash />
          </span>
        </h2>
        <div id={todoListDomId} className={`accordion-collapse collapse ${isCollapsed ? '' : 'show'}`}>
          <div className="accordion-body">
            {todos?.length ? (
              <ul className="list-group mb-2">
                {todos.map((todo) => <Todo key={todo.id} todo={todo} listId={id} />)}
              </ul>
            ) : null}
            <input
              type="text"
              className="form-control"
              placeholder="Add item"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={addTodo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
