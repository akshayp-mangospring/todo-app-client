import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  createTodoListItem, deleteTodoList, deleteTodoListFromState, editTodoList
} from "@store/todoListsSlice";
import { isEnterKeyPressed } from "@utils";
import Edit from '@icons/Edit';
import Trash from '@icons/Trash';
import BackArrow from '@icons/BackArrow';
import Todo from "@app_components/Todo";

const TodoList = ({ list: { id, title, todoListItems: todos } }) => {
  const todoListDomId = `todo_list_${id}`;
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [tempValue, setTempValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addTodo = (e) => {
    if (isEnterKeyPressed(e)) {
      dispatch(createTodoListItem({ listId: id, content: inputValue }));
      setInputValue('');
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);


  const editTodo = async (e) => {
    if (isEnterKeyPressed(e)) {
      await dispatch(editTodoList({
        id,
        title: tempValue,
      }));
      setIsEditing(false);
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
          {isEditing ? (
            <div className="d-flex align-items-center py-3 px-2 border-bottom">
              <div
                className="d-flex align-items-center flex-shrink-0"
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
              >
                <BackArrow />
              </div>
              <input
                type="text"
                className="form-control ms-1"
                placeholder="Add List Title"
                value={tempValue}
                ref={inputRef}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={editTodo}
              />
              <div role="button" className="d-flex align-items-center text-danger flex-shrink-0 ms-2" onClick={deleteList}>
                <Trash />
              </div>
            </div>
          ) : (
            <>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
              >
                <Edit />
              </span>
            </>
          )}
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
