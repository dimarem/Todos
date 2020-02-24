<template>
    <div class="controls">
        <transition name="history-buttons">
            <div 
                v-if="historyButtonsRequired" 
                class="history-buttons"
            >
                <!-- кнопка откатывающая состояние текущей заметки назад -->
                <button 
                    :class="{disabled: changeBackButtonDisabled}" 
                    @click="$emit('change-back')"
                >Назад</button>
                <!-- кнопка откатывающая состояние текущей заметки вперед -->
                <button 
                    :class="{disabled: changeForwardButtonDisabled}"
                    @click="$emit('change-forward')"
                >Вперед</button>
                <!-- кнопка сбрасывающая состояние текущей заметки -->
                <button @click="$emit('cancel')">Сбросить</button>
            </div>
        </transition>
        <div class="basic-buttons">
            <!-- кнопка удаляющая текущую заметку -->
            <button @click="$emit('remove')">Удалить</button>
            <!-- кнопка сохраняющая состояние текущей заметки -->
            <button @click="$emit('save')">Сохранить</button>
        </div>
    </div>
</template>

<script>
    /**
     * Данный компонент формирует область
     * содержащую элементы управления текущей заметкой.
     */
    export default {
        props: {
            /**
             * Индикатор необходимости отображения
             * кнопок для переключения между состояниями
             * изменений текущей редактируемой заметки.
             */
            historyButtonsRequired: {
                type: Boolean,
                required: false
            },
            /**
             * Индикатор визуальной активности
             * кнопки отката состояния заметки назад.
             */
            changeBackButtonDisabled: {
                type: Boolean,
                required: true
            },
            /**
             * Индикатор визуальной активности
             * кнопки отката состояния заметки вперед.
             */
            changeForwardButtonDisabled: {
                type: Boolean,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .controls {
        margin-top: 4rem;

        @media screen and (min-width: 651px) {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-end;
        }

        .history-buttons, .basic-buttons {
            @media screen and (max-width: 650px) {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }
        }

        .history-buttons {
            @media screen and (min-width: 651px) {
                margin-right: 4rem;
            }
        }

        .history-buttons {
            @media screen and (max-width: 650px) {
                margin-bottom: 1.5rem;
            }
        }

        button {
            cursor: pointer;
            box-sizing: border-box;
            border: none;
            outline: none;
            padding: .8rem 1rem;
            font-size: .8rem;
            font-family: $sans-bold;
            background-color: rgb(235, 235, 235);
            transition: .3s ease;

            @media screen and (max-width: 650px) {
                margin: 5px;
            }

            @media screen and (max-width: 390px) {
                width: 100%;
            }

            &.disabled {
                opacity: .4;
            }

            &:not(:last-of-type) {
                margin-right: 5px;
            }

            &:hover {
                background-color: rgb(220, 220, 220);
            }
        }

        .history-buttons-enter, .history-buttons-leave-to {
            opacity: 0;
        }

        .history-buttons-enter-active, .history-buttons-leave-active {
            transition: .3s ease;
        }
    }
</style>
