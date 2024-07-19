import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { isEnterKeyPressed } from "@utils";
import { editTodoListItem, deleteTodoListItem, deleteTodoListItemFromState } from "@store/todoListsSlice";

import Trash from '@icons/Trash';
import Edit from '@icons/Edit';
import BackArrow from '@icons/BackArrow';

const Todo = ({ todo: { content, complete, id }, listId }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(content);

  const editTodo = async (e) => {
    if (isEnterKeyPressed(e)) {
      await dispatch(editTodoListItem({
        itemId: id,
        listId,
        content: tempValue,
      }));
      setIsEditing(false);
    }
  };

  const markTodoDone = async () => {
    await dispatch(editTodoListItem({
      itemId: id,
      listId,
      complete: !complete
    }));
  };

  const deleteTodo = async () => {
    const data = {
      itemId: id,
      listId,
    };

    await dispatch(deleteTodoListItem(data));
    dispatch(deleteTodoListItemFromState(data));
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <li className="d-flex align-items-center list-group-item todo-list-item">
      {isEditing ? (
        <>
          <div
            className="d-flex align-items-center flex-shrink-0"
            role="button"
            onClick={() => setIsEditing(false)}
          >
            <BackArrow />
          </div>
          <input
            type="text"
            className="form-control ms-1"
            placeholder="Add item"
            value={tempValue}
            ref={inputRef}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={editTodo}
          />
          <div role="button" className="d-flex align-items-center text-danger flex-shrink-0 ms-2" onClick={deleteTodo}>
            <Trash />
          </div>
        </>
      ) : (
        <>
          <div className="me-auto">
            <input
              type="checkbox"
              checked={complete}
              className="form-check-input"
              role="button"
              onChange={markTodoDone}
            />
            <span className={`fs-6 ms-2 ${complete && 'text-decoration-line-through'}`}>{content}</span>
          </div>
          {!complete && (
            <div
              className="align-items-center flex-shrink-0 edit-options"
              role="button"
              onClick={() => setIsEditing(true)}
            >
              <Edit />
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default Todo;
