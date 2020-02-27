import axios from 'axios';

// NOTE: here for the fake API in PRODUCTION used service: https://my-json-server.typicode.com/
// it has some limitations:
// Changes are faked and aren't persisted (just like JSONPlaceholder)
// Requests are cached (1 minute)
// db.json has limits
// All servers are public
// Private GitHub repositories aren't supported (yet)
const baseAPI = process.env.VUE_APP_BASE_URL;

const state = {
  todos: []
};

const getters = {
  allTodos: (state) => state.todos
};

const actions = {
  // make request
  async fetchTodos({ commit }) {
    const response = await axios.get(baseAPI);
    commit('setTodos', response.data);
  },
  async addTodo({ commit }, title) {
    console.log(process.env.VUE_APP_BASE_URL);
    const response = await axios.post(baseAPI, { title, completed: false });
    commit('newTodo', response.data);
  },
  async deleteTodo({ commit }, id) {
    await axios.delete(`${baseAPI}/${id}`);
    commit('removeTodo', id);
  },
  async filterTodos({ commit }, e) {
    // get selected number
    const limit = e.target.value;

    // to return limited array starting from the last element,
    // so to show only newest todos
    const response = await axios.get(`${baseAPI}`);
    const limited = response.data.length - limit < 0 ? 0 : response.data.length - limit;

    const limitedResponse = response.data.slice(limited);
    console.log(limitedResponse);
    console.log(response.data);

    // commit('setTodos', response.data);
    commit('setTodos', limitedResponse);
  },
  async updateTodo({ commit }, updatedTodo) {
    const response = await axios.put(`${baseAPI}/${updatedTodo.id}`, updatedTodo);
    console.log(response.data);
    commit('updateTodo', response.data);
  }
};

const mutations = {
  setTodos: (state, todos) => { state.todos = todos.slice().reverse() },
  newTodo: (state, todo) => {
    state.todos.unshift(todo);
  },
  removeTodo: (state, id) => state.todos = state.todos.filter(todo => todo.id != id),
  updateTodo: (state, updatedTodo) => {
    const index = state.todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      state.todos.splice(index, 1, updatedTodo)
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};