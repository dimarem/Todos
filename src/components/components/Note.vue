<template>
    <article>
        <!-- наименование заметки -->
        <h2>{{ description.title }}</h2>
        <!-- данный абзац содержит до 4 задач заметки, если такие есть -->
        <p v-if="tasks.length">
            <ul>
                <li 
                    v-for="(item, index) in tasks" 
                    :key="item.description + '-' + index"
                >
                    {{ item.description }}
                </li>
                <li v-if="hasMore">...</li>
            </ul>
        </p>
        <!-- данный блок содержит контрольные элементы заметки -->
        <div class="controls">
            <!-- ссылка на страницу редактирования текущей заметки -->
            <router-link :to="url">
                <svg viewBox="0 0 383.947 383.947"><g><polygon points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893"/><path d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04 C386.027,77.92,386.027,64.373,377.707,56.053z"/></g></svg>
            </router-link>
            <!-- кнопка для удаления текущей заметки -->
            <button @click="$emit('remove', index)">
                <svg viewBox="0 0 515.556 515.556"><path d="m64.444 451.111c0 35.526 28.902 64.444 64.444 64.444h257.778c35.542 0 64.444-28.918 64.444-64.444v-322.222h-386.666z"/><path d="m322.222 32.222v-32.222h-128.889v32.222h-161.111v64.444h451.111v-64.444z"/></svg>
            </button>
        </div>
    </article>
</template>

<script>
    /**
     * Компонент формирующий "заметку" 
     * пользователя на главной странице приложения.
     */
    export default {
        props: {
            /**
             * Объект содержащий описание заметки.
             */
            description: {
                type: Object,
                required: true
            },
            /**
             * Порядковый номер заметки.
             */
            index: {
                type: Number,
                required: true
            }
        },
        computed: {
            /**
             * Возвращает несколько пунктов задач по заметке,
             * которые не отмечены как выполненные.
             * 
             * @returns {array}
             */
            tasks() {
                let n = 0;
                let tasks = this.description.tasks;
                let result = [];

                for (let i = 0; i < tasks.length; i++) {
                    if (n >= 4) {
                        this.hasMore = true;
                        break;
                    }

                    if (!tasks[i].done) {
                        result.push(tasks[i]);
                        n++;
                    }
                }

                return result;
            },
            /**
             * Формирует путь для 
             * редактирования данной заметки.
             * 
             * @returns {string}
             */
            url() {
                return `/edit/${this.index + 1}`;
            }
        },
        data() {
            return {
                hasMore: false // {boolean} индикатор наличия более 4 незаверщенных задач
            }
        }
    }
</script>

<style lang="scss" scoped>
    article {
        position: relative;
        max-width: 700px;
        margin: auto;

        &:not(:last-of-type) {
            border-bottom: 1px solid rgb(230, 230, 230);
        }

        h2 {
            padding-right: 100px !important; /* справа размещаются контрольные элементы */
            font-family: $sans-bold;
            font-weight: normal;
            font-size: 1rem;
            overflow: hidden;
        }

        p {
            ul {
                li {
                    font-size: .9rem;
                }
            }
        }

        .controls {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100px;
            background-color: white;

            a, button {
                cursor: pointer;

                &:hover svg {
                    fill: black;
                }

                svg {
                    width: 1rem;
                    height: 1rem;
                    fill: rgb(150, 150, 150);
                    transition: .3s ease;
                }
            }

            a {
                margin-right: 10px;
            }

            button {
                padding: 0;
                border: none;
                outline: none;
            }
        }
    }
</style>
