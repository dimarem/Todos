<template>
    <section class="editor-window">
        <main>
            <header>Редактирование задачи</header>
            <label>
                <input 
                    v-model.trim="description" 
                    @keyup.enter="notify"
                    type="text" 
                >
                <transition name="error">
                    <p 
                        v-if="!description" 
                        class="error"
                    >Описание не должно быть пустым</p>
                </transition>
            </label>
            <div class="buttons">
                <button @click="notify">Изменить</button>
                <button @click="$emit('close')">Отмена</button>
            </div>
        </main>
    </section>
</template>

<script>
    /**
     * Компонент формирующий окно для 
     * редактирования текстовой подписи задачи в чекбоксе.
     */
    export default {
        props: {
            /**
             * Описание задачи, которую
             * пользователь редактирует.
             */
            taskDescription: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                description: this.taskDescription
            }
        },
        methods: {
            /**
             * Уведомляет родительский компонент 
             * о необходимости редактирования данных
             */
            notify() {
                if (!this.description) return; // если поле пустое

                this.$emit("edit", this.description);
            }
        }
    }
</script>

<style lang="scss">
    .editor-window {
        box-sizing: border-box;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        padding: 1rem;
        background-color: rgba($color: #000000, $alpha: .5);

        main {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 500px;
            height: 300px;
            background-color: white;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 10px 15px rgba($color: #000000, $alpha: .2);
            transform: translate(-50%, -50%);

            @media screen and (max-width: 600px) {
                width: 400px;
            }

            @media screen and (max-width: 460px) {
                width: 300px;
            }

            header {
                padding: 2rem 1rem;
                background-color: #455a64;
                color: white;
            }

            label {
                position: relative;
                display: block;
                width: 90%;
                margin: 2rem auto;

                input {
                    box-sizing: border-box;
                    width: 100%;
                    padding: .8rem 1rem;
                    font-family: $sans-reg;
                    font-size: 1rem;
                    border-radius: 3px;
                    border: none;
                    background-color: rgb(240, 240, 240);
                }

                .error {
                    position: absolute;
                    left: 0;
                    top: calc(2rem + 5px);
                    font-family: $sans-bold;
                    font-size: .8rem;
                    color: red;
                }

                .error-enter, .error-leave-to {
                    opacity: 0;
                }

                .error-enter-active, .error-leave-active {
                    transition: .3s ease;
                }
            }

            .buttons {
                display: flex;
                justify-content: center;
                width: 90%;
                margin: auto;

                button {
                    cursor: pointer;
                    box-sizing: border-box;
                    width: 100px;
                    border: none;
                    outline: none;
                    padding: .8rem 1rem;
                    border-radius: 3px;
                    font-size: .9rem;
                    font-family: $sans-bold;
                    background-color: rgb(235, 235, 235);
                    transition: .3s ease;

                    &:not(:last-of-type) {
                        margin-right: 5px;
                    }

                    &:hover {
                        background-color: rgb(220, 220, 220);
                    }
                }
            }
        }
    }
</style>
