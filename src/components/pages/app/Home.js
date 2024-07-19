import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getTodoLists, selectLists, createTodoList } from "@store/todoListsSlice";
import TodoList from "@app_components/TodoList";
import TodoListInput from "@app_components/TodoListInput";

const HomePage = () => {
  const dispatch = useDispatch();
  const myTodoLists = useSelector(selectLists);

  useEffect(() => {
    async function fetchData() {
      await dispatch(getTodoLists());
    }

    fetchData();
  }, [dispatch]);

  const addTodoList = async (listTitle) => {
    await dispatch(createTodoList(listTitle));
  };

  return (
    <div className='container'>
      <h1 className="text-center mb-5">My Todos</h1>
      <TodoListInput onSubmit={addTodoList} />
      <div className="row d-flex flex-wrap g-3">
        {myTodoLists?.map((list) => <TodoList key={list.id} list={list} />)}
      </div>
    </div>
  );
};

export default HomePage;
