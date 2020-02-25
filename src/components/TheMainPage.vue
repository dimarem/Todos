<template>
    <section class="main-page">
        <header>Заметки</header>
        <main>
            <header>
                <!-- поле для ввода названия заметки -->
                <Input
                    name="note" 
                    caption="Создать заметку" 
                    @process-input="createNote"
                />
                <!-- подсказка пользователю -->
                <p class="prompt">
                    <svg viewBox="0 0 512 512"><g><path d="M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256 s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512s132.667-26.629,181.02-74.98 C485.371,388.667,512,324.38,512,256S485.371,123.333,437.02,74.98z M256,101c24.813,0,45,20.187,45,45s-20.187,45-45,45 s-45-20.187-45-45S231.187,101,256,101z M320,401H190v-30h21V251h-20v-30h110v150h19V401z"/></g></svg>
                    Для создания заметки, введите ее содержание и нажмите Enter
                </p>
            </header>
            <!-- область содержащая описание заметки -->
            <template v-if="notes.length">
                <Note 
                    v-for="(item, index) in notes" 
                    :key="item.title + '-' + index" 
                    :description="item"
                    :index="index"
                    @remove="showConfirmationWindow"
                />    
            </template>
            <!-- данный параграф отображается если данных по заметкам нет -->
            <template v-else>
                <p class="padding">Заметки отсутствуют</p>
            </template>
        </main>
        <transition name="confirmation-window">
            <!-- окно для подтверждения удаления заметки -->
            <TheConfirmationWindow 
                v-if="confirmationRequired" 
                title="Вы подтверждаете удаление текущей заметки?"
                @close="closeConfirmationWindow"
                @confirm="confirmRemoval"
            />
        </transition>
    </section>
</template>

<script>
    /**
     * Компонент формирующий главную 
     * страницу с заметками пользователя.
     */
    import Input                      from "./components/Input.vue";
    import Note                       from "./components/Note.vue";
    import { mapState, mapMutations } from "vuex";

    export default {
        components: {
            Input,
            Note,
            TheConfirmationWindow: () => import(/* webpackChunkName: "TheConfirmationWindow" */ "./components/TheConfirmationWindow.vue"),
        },
        data() {
            return {
                deleteIndex: undefined,      // {number} порядковый номер заметки, требующий подтверждения удаления
                confirmationRequired: false, // {boolean} индикатор необходимости отображения окна для подтверждения удаления заметки
            }
        },
        computed: {
            ...mapState({
                notes: state => state.notes, // {array} массив содержащий данные по заметкам
            })
        },
        methods: {
            ...mapMutations(["addToStore", "removeFromStore"]),
            /**
             * Создает новую заметку и добавляет ее в хранилище.
             * 
             * @param {string} noteTitle - название заметки введенное пользователем.
             */
            createNote(noteTitle) {
                let note = {
                    title: noteTitle, // название заметки
                    tasks: []         // массив содержащий данные по заданиям данной заметки
                }

                this.addToStore(note);
            },
            /**
             * Отображает окно для подтверждения удаления заметки.
             * 
             * @param {number} index - порядковый номер переданный дочерним компонентом.
             */
            showConfirmationWindow(index) {
                // запомним порядковый номер заметки, которую требуется удалить
                this.deleteIndex = index;
                // отобразим окно подтверждения удаления
                this.confirmationRequired = true;
            },
            /**
             * Скрывает окно для подтверждения удаления заметки.
             */
            closeConfirmationWindow() {
                // скроем окно подтверждения удаления
                this.confirmationRequired = false;
                // сбросим данные по индексу
                this.deleteIndex = undefined;
            },
            /**
             * Удаляет заметку их хранилища.
             */
            confirmRemoval() {
                let index = this.deleteIndex; // порядковый номер заметки для удаления

                this.removeFromStore(index);

                this.confirmationRequired = false;
                this.deleteIndex = undefined;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .main-page {
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

            @media screen and (max-width: 460px) {
                font-size: 3rem;
            }
        }

        main {
            max-width: 800px;
            min-height: 300px;
            margin: auto;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 15px 5px rgba($color: #000000, $alpha: .2);

            header {
                margin: auto;
                margin-bottom: 3rem;
                max-width: 600px;
                
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
            }

            .padding {
                margin: 5rem 0;
                text-align: center;
            }
        }

        .confirmation-window-enter, .confirmation-window-leave-to {
            opacity: 0;
        }

        .confirmation-window-enter-active, .confirmation-window-leave-active {
            transition: .3s ease;
        }
    }
</style>
