import Vue  from "vue/dist/vue.min.js";
import Vuex from "vuex/dist/vuex.min.js";

Vue.use(Vuex);

// получим ранее сохраненные заметки из localStorage
// представляют собой сериализованный массив объектов с данными по заметкам
const previousNotes = localStorage.getItem("notes");

const store = new Vuex.Store({
    state: {
        /**
         * В данном массиве хранится информация по заметкам.
         */
        notes: previousNotes ? JSON.parse(previousNotes) : []
    },
    mutations: {
        /**
         * Добавляет в хранилище новую заметку.
         * Сохраняет данные в localStorage.
         * 
         * @param {object} state - хранилище.
         * @param {object} note - объект содержащий данные по заметке.
         */
        addToStore(state, note) {
            state.notes.unshift(note);

            localStorage.setItem("notes", JSON.stringify(state.notes));
        },
        /**
         * Удаляет заметку из хранищила.
         * Сохраняет данные в localStorage.
         * 
         * @param {object} state - хранилище. 
         * @param {number} index - порядковый номер заметки.
         */
        removeFromStore(state, index) {
            state.notes.splice(index, 1);

            localStorage.setItem("notes", JSON.stringify(state.notes));
        },
        /**
         * Обновляет данные в хранищиле.
         * Сохраняет данные в localStorage.
         * 
         * @param {object} state - хранилище. 
         * @param {object} data - Объект содержащий информацию для обновления.
         */
        updateData(state, data) {
            let {index, note} = data; // порядковый номер заметки в общем списке и данные по заметке соответственно
            
            state.notes.splice(index, 1, note);

            localStorage.setItem("notes", JSON.stringify(state.notes));
        }
    }
})

export default store;
