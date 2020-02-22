<template>
    <section class="edit-page">
        <header>Редактирование заметки</header>
        <main>
            <template v-if="note">
                <!-- содержит описание заметки и ее задачи -->
                <div class="data-container">
                    <!-- описание заметки -->
                    <Input 
                        v-model.trim="note.title"
                        name="note" 
                        caption="Содержание заметки" 
                        :value="note.title"
                        :clearAfterProcess="false"
                    />
                    <!-- поле для создания задачи -->
                    <Input 
                        name="task"
                        caption="Добавить задачу"
                        @process-input="createTask"
                    />
                    <!-- подсказка пользователю -->
                    <p class="prompt">
                        <svg viewBox="0 0 512 512"><g><path d="M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256 s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512s132.667-26.629,181.02-74.98 C485.371,388.667,512,324.38,512,256S485.371,123.333,437.02,74.98z M256,101c24.813,0,45,20.187,45,45s-20.187,45-45,45 s-45-20.187-45-45S231.187,101,256,101z M320,401H190v-30h21V251h-20v-30h110v150h19V401z"/></g></svg>
                        Для добавления задачи, введите ее содержание и нажмите Enter
                    </p>
                    <!-- секция содержащая задачи заметки -->
                    <div 
                        v-if="hasTasks" 
                        class="tasks"
                    >
                        <header>Текущие задачи:</header>
                        <Checkbox 
                            v-for="(item, index) in note.tasks"
                            :key="item.description + '-' + index"
                            :content="item"
                            :index="index"
                            @change="updateTaskStatus"
                            @remove="processTaskRemoval"
                            @edit="showTaskEditorWindow"
                        />
                    </div>
                    <!-- элементы управления текущей заметкой -->
                    <TheEditControls 
                        :historyButtonsRequired="historyButtonsRequired"
                        :changeBackButtonDisabled="changeBackButtonDisabled"
                        :changeForwardButtonDisabled="changeForwardButtonDisabled"
                        @cancel="processMutationCancel"
                        @save="processSave"
                        @remove="processNoteRemoval"
                        @change-back="changeNoteStateBack"
                        @change-forward="changeNoteStateForward"
                    />
                </div>
            </template>
            <!-- отображается если данных по заметке с таким номером нет -->
            <p 
                v-else 
                class="padding"
            >Данные по заметке с таким номером отсутствуют</p>
            <!-- абзац ниже появляется при условии сохранения состояния текущей заметки -->
            <transition name="save-indicator">
                <p 
                    v-if="saveIndicatorRequired" 
                    class="save-indicator"
                >Сохранено</p>
            </transition>
        </main>
        <transition name="confirmation-window">
            <!-- окно для подтверждения удаления заметки -->
            <TheConfirmationWindow 
                v-if="confirmationRequired" 
                :title="confirmationWindowTitle"
                @close="closeConfirmationWindow"
                @confirm="confirmAction"
            />
        </transition>
        <transition name="editor-window">
            <!-- окно для редактирования описания задачи -->
            <TheEditorWindow 
                v-if="editorRequired" 
                :taskDescription="taskDescription"
                @close="closeEditorWindow"
                @edit="editTask"
            />
        </transition>
    </section>
</template>

<script>
    /**
     * Компонент формирующий страницу 
     * для редактирования заметки.
     */
    import Input                 from "./components/Input.vue";
    import Checkbox              from "./components/Checkbox.vue";
    import TheEditControls       from "./components/TheEditControls.vue";
    import TheConfirmationWindow from "./components/TheConfirmationWindow.vue";
    import TheEditorWindow       from "./components/TheEditorWindow.vue";
    import { mapMutations }      from "vuex";
    
    export default {
        components: {
            Input,
            Checkbox,
            TheEditControls,
            TheConfirmationWindow,
            TheEditorWindow
        },
        data() {
            let {index, origin, note, history} = this.getBasicParameters();

            return {
                index,
                origin,
                note,
                history,
                throttle: false,                    // {boolean} переменная-заглушка
                historyPoint: 0,                    // {number} текущая позиция в "истории", позволяет следить за ходом изменений состояния заметки
                deleteTaskIndex: undefined,         // {number} порядковый номер задачи, для которой требуется подтверждение удаления
                confirmationRequired: false,        // {boolean} индикатор необходимости отображения окна для подтверждения действия
                taskIndex: undefined,               // {number} порядковый номер задачи, для которой требуется отредактировать описание
                taskDescription: undefined,         // {string} копия описания задачи, которую пользователь намерен изменить
                editorRequired: false,              // {boolean} индикатор необходимости отображения окна для редактирования описания задачи
                actionToConfirm: undefined,         // {string} содержит название действия пользователя, требующее подтверждения
                confirmationWindowTitle: undefined, // {string} т.к. окно для подтверждения действия это переиспользуемый компонент, он может иметь разный заголовок
                historyButtonsRequired: false,      // {boolean} индикатор необходимости отображения кнопок переключения по "истории" состояний заметки
                saveIndicatorRequired: false,       // {boolean} индикатор необходимости отображения записи об успешном сохранении состояния заметки
                innerTimer: undefined,              // {number} номер таймера в методе processSave
                
            }
        },
        computed: {
            /**
             * Определяет факт наличия сохраненных
             * задач для текущей заметки.
             * 
             * @returns {boolean}
             */
            hasTasks() {
                if (this.note.tasks.length > 0) return true;

                return false;
            },
            /**
             * Индикатор визуальной активности
             * кнопки отката состояния заметки назад.
             * 
             * @returns {boolean}
             */
            changeBackButtonDisabled() {
                return this.historyPoint === 0;
            },
            /**
             * Индикатор визуальной активности
             * кнопки отката состояния заметки вперед.
             * 
             * @returns {boolean}
             */
            changeForwardButtonDisabled() {
                return this.historyPoint === (this.history.length - 1);
            },
        },
        watch: {
            /**
             * Следит за наличием изменений в объекте заметки.
             */
            note: {
                deep: true,
                handler() {
                    // наличие установленной переменной throttle в true
                    // говорит о том что текущее состояние добавлять в историю не требуется
                    if (this.throttle) {
                        this.throttle = false;
                    } else {
                        // в данной ветке условия идет реализация механизма "истории",
                        // который позволяет пользователю откатываться по состояниям заметки
                        // вперед-назад, заполняя массив hidtory
                        // 
                        // ВАЖНО! Текущее состояние может быть неопределено
                        // и установлено в значение undefined. Данная ситуация
                        // может возникнуть например если пользователь в ручную
                        // изменяет параметр в адресной строке при этом 
                        // в хранилище запись с таким номером отсутствует
                        if (this.note) {
                            let copy = this.createCopy(this.note);

                            this.history.push(copy);
                            this.historyPoint += 1;
                            this.historyButtonsRequired = true;
                        }
                    }
                }
            },
            /**
             * Отслеживает изменение текущего маршрута.
             * Данный наблюдатель сработает в большинстве случаев
             * при ручном изменении параметра в адресной строке.
             */
            $route() {
                // т.к. при изменении маршрута будет вызван наблюдатель
                // за объектом note, нужно избежать лишних манипуляций с 
                // историей, установив заглушку
                this.throttle = true;

                let {index, origin, note, history} = this.getBasicParameters();

                this.index = index;
                this.origin = origin;
                this.note = note;
                this.history = history;
                this.historyButtonsRequired = false;
                this.historyPoint = 0;
            }
        },
        methods: {
            ...mapMutations(["updateData", "removeFromStore"]),
            /**
             * Возвращает объект содержащий порядковый номер
             * текущей заметки в общем списке, объект содержащий 
             * данные по текущей заметке и его копию, а также массив,
             * который будет содержать состояния заметки в разные моменты времени.
             * 
             * @returns {object}
             */
            getBasicParameters() {
                // получим порядковый номер заметки в хранилище
                let index = parseInt(this.$route.params.index) - 1;

                // массив содержащий данные по заметкам
                let notes = this.$store.state.notes;

                // объект содержащий изначальные данные по текущей заметке
                let origin = notes[index] ? notes[index] : undefined;

                // чтобы не мутировать данные напрямую, создадим копию 
                // с которой в дальнейшем будет непосредственно проводится работа
                let note = origin ? this.createCopy(origin) : undefined;

                // данный массив содержит "снимки" состояний заметки, реализуя механизм "истории"
                let history = note ? [this.createCopy(note)] : [];

                
                return {index, origin, note, history};
            },
            /**
             * Создает задачу для текущей заметки.
             * 
             * @param {string} taskDescription - описание задачи.
             */
            createTask(taskDescription) {
                /**
                 * Создадим объект задачи.
                 * 
                 * @param {string} description - описание задачи.
                 * @param {boolean} done - завершена задача или нет.
                 */
                let task = {
                    description: taskDescription,
                    done: false
                }

                this.note.tasks.unshift(task);
            },
            /**
             * Создает копию исходного объекта.
             * ВАЖНО! В атрибуте tasks содержится ссылка на массив,
             * элементами, которого являются объекты.
             */
            createCopy(obj) {
                let title = obj.title;
                let tasks = obj.tasks.map(item => {
                    return Object.assign({}, item);
                })

                return {title, tasks};
            },
            /**
             * Обновляет заглавие заметки.
             * 
             * @param {string} title - заглавие заметки.
             */
            updateNoteTitle(title) {
                this.note.title = title;
            },
            /**
             * Изменяет статус задачи (выполнено | не выполнено).
             * 
             * @param {boolean} status - статус выполнения задачи.
             * @param {number} index - порядковы номер задачи в общем списке.
             */
            updateTaskStatus(status, index) {
                this.note.tasks[index].done = status;
            },
            /**
             * Отображает окно для подтверждения удаления заметки.
             */
            showConfirmationWindow() {
                this.confirmationRequired = true;
            },
            /**
             * Скрывает окно для подтверждения удаления заметки.
             */
            closeConfirmationWindow() {
                this.confirmationRequired = false;
                this.deleteTaskIndex = undefined;
                this.actionToConfirm = undefined;
                this.confirmationWindowTitle = undefined;
            },
            /**
             * Обрабатывает удаление задачи.
             * 
             * @param {number} index - порядковый номер задачи.
             */
            processTaskRemoval(index) {
                // запомним порядковый номер задачи, которую требуется удалить
                this.deleteTaskIndex = index;
                // установим действие, которое требуется подтвердить
                this.actionToConfirm = "task-removal";
                // установим заголовок для окна подтверждения
                this.confirmationWindowTitle = "Вы подтверждаете удаление задачи?";

                this.showConfirmationWindow();
            },
            /**
             * Удаляет текущую задачу из общего списка.
             */
            removeTask() {
                let index = this.deleteTaskIndex; // порядковый номер задачи для удаления

                this.note.tasks.splice(index, 1);

                this.closeConfirmationWindow();
            },
            /**
             * Обрабатывает удаление всей заметки.
             */
            processNoteRemoval() {
                // установим действие, которое требуется подтвердить
                this.actionToConfirm = "note-removal";
                // установим заголовок для окна подтверждения
                this.confirmationWindowTitle = "Вы подтверждаете удаление текущей заметки?";

                this.showConfirmationWindow();
            },
            /**
             * Удаляет данную заметку из хранилища Vuex,
             * вызывая соответствующие мутации.
             * Переводит пользователя на главную страницу.
             */
            removeNote() {
                this.removeFromStore(this.index);
                this.closeConfirmationWindow();
                this.$router.push({path: "/"});
            },
            /**
             * Обрабытывает отмену произведенных изменений
             * в текущей заметке, возвращая ее к первоначальному состоянию.
             */
            processMutationCancel() {
                // установим действие, которое требуется подтвердить
                this.actionToConfirm = "cancel-mutation";
                // установим заголовок для окна подтверждения
                this.confirmationWindowTitle = "Вы подтверждаете отмену всех изменений?";

                this.showConfirmationWindow();
            },
            /**
             * Отменяет все произведенные изменения в текущей 
             * заметке, приводя ее в исходное состояние.
             */
            cancelMutations() {
                this.throttle = true;                        // установим заглушку, чтобы не дублировать состояние в истории
                this.historyPoint = 0;                       // сбросим наблюдение за ходом изменений
                this.note = this.createCopy(this.origin);    // возвращает состояние заметки в исходное состояние
                this.history = [this.createCopy(this.note)]; // почистим историю
                this.closeConfirmationWindow();
                this.$nextTick(() => {
                    this.historyButtonsRequired = false;     // кнопки переключения по "истории" состояний заметки пока не нужны
                })
            },
            /**
             * Подтверждает действие пользователя,
             * вызывая соответствующие методы.
             */
            confirmAction() {
                if (this.actionToConfirm === "task-removal") this.removeTask();
                if (this.actionToConfirm === "note-removal") this.removeNote();
                if (this.actionToConfirm === "cancel-mutation") this.cancelMutations();
            },
            /**
             * Отображает окно для редактирования описания задачи.
             * 
             * @param {string} description - текущее описание задачи, которую пользователь хочет отредактировать.
             * @param {number} index - порядковый номер задачи в общем списке.
             */
            showTaskEditorWindow(description, index) {
                // передадим текущее описание задачи в окно для редактирования
                this.taskDescription = description;
                // запомним порядковый номер задачи
                this.taskIndex = index;
                // отобразим окно редактирования описания задачи
                this.editorRequired = true;
            },
            /**
             * Скрывает окно для подтверждения удаления заметки.
             */
            closeEditorWindow() {
                this.editorRequired = false;
                this.taskIndex = undefined;
                this.taskDescription = undefined;
            },
            /**
             * Редактирует описание задачи.
             * 
             * @param {string} newDescription - новое описание задачи.
             */
            editTask(newDescription) {
                let index = this.taskIndex; // порядковый номер задачи для редактирования

                this.note.tasks[index].description = newDescription;

                this.closeEditorWindow();
            },
            /**
             * Производит процесс сохранения 
             * данных вызывая соответствующие мутации
             * в хранилище Vuex.
             */
            processSave() {
                let index = this.index;
                let note = this.note;
                let data = {index, note};

                this.updateData(data);

                // уведомим пользователя об успешном сохранении
                this.saveIndicatorRequired = true;

                if (this.innerTimer) clearTimeout(this.innerTimer);

                this.innerTimer = setTimeout(() => {
                    this.saveIndicatorRequired = false;
                }, 2000)
            },
            /**
             * Откатывает состояние заметки назад по истории состояний.
             */
            changeNoteStateBack() {
                if (this.historyPoint === 0) return;

                this.historyPoint -= 1;
                this.throttle = true; // установим заглушку, чтобы не дублировать состояние в истории

                let previousCondition = this.history[this.historyPoint];

                this.note = this.createCopy(previousCondition);
            },
            /**
             * Откатывает состояние заметки вперед по истории состояний.
             */
            changeNoteStateForward() {
                if (this.historyPoint === undefined) return;
                if (this.historyPoint === 0 && this.history.length === 0) return;
                if (this.historyPoint >= this.history.length - 1) return;

                this.historyPoint += 1;
                this.throttle = true; // установим заглушку, чтобы не дублировать состояние в истории

                let nextCondition = this.history[this.historyPoint];

                this.note = this.createCopy(nextCondition);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .edit-page {
        box-sizing: border-box;
        position: relative;
        min-height: 100vh;
        padding: 1rem 1rem 3rem;

        & > header {
            padding: 1rem;
            text-align: center;
            font-size: 5rem;
            font-family: $serif-reg;
            color: rgb(230, 230, 230);

            @media screen and (max-width: 800px) {
                font-size: 3rem;
            }

            @media screen and (max-width: 500px) {
                font-size: 2rem;
            }
        }

        main {
            position: relative;
            max-width: 800px;
            min-height: 300px;
            margin: auto;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 15px 5px rgba($color: #000000, $alpha: .2);

            .data-container {
                max-width: 700px;
                margin: auto;

                .prompt {
                    display: flex;
                    align-items: center;
                    margin: 0;
                    color:rgb(150, 150, 150);
                    font-size: .8rem;

                    svg {
                        flex-shrink: 0;
                        width: 1.2rem;
                        height: 1.2rem;
                        margin-right: 5px;
                        fill: rgb(150, 150, 150);
                    }
                }

                .tasks {
                    margin-top: 4rem;

                    header {
                        font-family: $sans-bold;
                        font-weight: normal;
                    }
                }
            }

            .padding {
                position: absolute;
                top: 50%;
                left: 50%;
                margin: 0;
                text-align: center;
                transform: translate(-50%, -50%);
            }

            .save-indicator {
                position: absolute;
                right: 10px;
                bottom: 10px;
                margin: 0;
                font: .8rem $sans-bold;
                color: rgb(100, 100, 100);
            }
        }

        .confirmation-window-enter, .confirmation-window-leave-to {
            opacity: 0;
        }

        .confirmation-window-enter-active, .confirmation-window-leave-active {
            transition: .3s ease;
        }

        .editor-window-enter, .editor-window-leave-to {
            opacity: 0;
        }

        .editor-window-enter-active, .editor-window-leave-active {
            transition: .3s ease;
        }

        .save-indicator-leave-to {
            opacity: 0;
        }

        .save-indicator-leave-active {
            transition: 1s ease;
        }
    }
</style>
