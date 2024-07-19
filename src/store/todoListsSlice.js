import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { backendUrl } from '@constants';
import { getData, putData, postData, deleteData } from '@rest_utils';

const initialState = {
  lists: [],
};

const todoListsSlice = createSlice({
  name: 'todoLists',
  initialState,
  reducers: {
    deleteTodoListFromState: (state, action) => {
      state.lists = state.lists.filter(todo => todo.id !== action.payload);
    },
    deleteTodoListItemFromState: (state, action) => {
      const { listId, itemId } = action.payload;
      const list = state.lists.find(list => list.id === listId);

      if (list) {
        list.todoListItems = list.todoListItems.filter(todo => todo.id !== itemId);
      }
    },
  },
  extraReducers: (builder) => {
    // Thunk Reducers
    builder
      .addCase(getTodoLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      });

    builder
      .addCase(createTodoList.fulfilled, (state, action) => {
        state.lists = [...state.lists, action.payload];
      });

    builder
      .addCase(deleteTodoList.fulfilled, (state, action) => {
        state.lists = [...state.lists, action.payload];
      });

    builder
      .addCase(createTodoListItem.fulfilled, (state, action) => {
        const { listId, todoItem } = action.payload;
        const list = state.lists.find(list => list.id === listId);

        if (list) {
          list.todoListItems = list.todoListItems || [];
          list.todoListItems.push(todoItem);
        }
      });

    builder
      .addCase(editTodoListItem.fulfilled, (state, action) => {
        const { listId, itemId, editedTodoItem } = action.payload;
        const list = state.lists.find(list => list.id === listId);

        if (list) {
          list.todoListItems = list.todoListItems.map(todoItem => {
            if (itemId === todoItem.id) return editedTodoItem;
            return todoItem;
          });
        }
      });

    builder
      .addCase(editTodoList.fulfilled, (state, action) => {
        const { id, editedTodoList } = action.payload;
        const list = state.lists.find(list => list.id === id);

        if (list) {
          list.title = editedTodoList.title;
          list.description = editedTodoList.description;
        }
      });

    builder
      .addCase(deleteTodoListItem.fulfilled, (state, action) => {
        const { listId, itemId } = action.payload;
        const list = state.lists.find(list => list.id === listId);

        if (list) {
          list.todoListItems = list.todoListItems.filter(todo => todo.id !== itemId);
        }
      });
  },
});

// Thunk Actions
export const getTodoLists = createAsyncThunk('todolists/get', async (_, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;

  try {
    return await getData(`${backendUrl}/todolists`, authToken);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createTodoList = createAsyncThunk('todolists/create', async (listData, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;
  const { title } = listData;

  try {
    return await postData(`${backendUrl}/todolists`, authToken, { title });
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const editTodoList = createAsyncThunk('todolists/editTitle', async (data, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;
  const { id, title, description } = data;

  try {
    const resp = await putData(`${backendUrl}/todolists/${id}`, authToken, { title, description });
    return { id, editedTodoList: resp };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteTodoList = createAsyncThunk('todolists/delete', async (listId, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;

  try {
    return await deleteData(`${backendUrl}/todolists/${listId}`, authToken);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createTodoListItem = createAsyncThunk('todolistItem/create', async (data, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;
  const { listId, content } = data;

  try {
    const resp = await postData(`${backendUrl}/todolists/${listId}/todos`, authToken, { content });
    return { listId, todoItem: resp };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const editTodoListItem = createAsyncThunk('todolistItem/edit', async (data, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;
  const { itemId, listId, content, complete } = data;

  try {
    const resp = await putData(`${backendUrl}/todolists/${listId}/todos/${itemId}`, authToken, { content, complete });
    return { listId, itemId, editedTodoItem: resp };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteTodoListItem = createAsyncThunk('todolistItem/delete', async (data, { getState, rejectWithValue }) => {
  const { currentUser } = getState();
  const authToken = currentUser.auth_token;
  const { itemId, listId } = data;

  try {
    return await deleteData(`${backendUrl}/todolists/${listId}/todos/${itemId}`, authToken);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const selectLists = (state) => state.todoLists.lists;

// Here we have to explicitly export the actions and the reducers as well.
export const { deleteTodoListFromState, deleteTodoListItemFromState } = todoListsSlice.actions;
export default todoListsSlice.reducer;
