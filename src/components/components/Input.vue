<template>
    <label :class="{focused}">
        <span 
            v-if="caption"
            :class="{deposed: captionDeposed}"
            class="caption"
        >
            {{caption}}
        </span>
        <input 
            v-model.trim="currentValue"
            v-bind="$attrs"
            :name="name"
            v-on="inputListeners"
            @focus="processFocus"
            @blur="processBlur"
            @keyup.enter="processInput"
            type="text"
        >
    </label>
</template>

<script>
    /**
     * Компонент input[type="text"].
     * 
     * @example
     * <Input name="input" caption="Ваше имя" value="Джон Доу" :clearAfterProcess="false">
     */

    export default {
        inheritAttrs: false,
        props: {
            /**
             * Имя компонента.
             */
            name: {
                type: String,
                required: true
            },
            /**
             * Заголовок компонента.
             */
            caption: {
                type: String,
                required: false
            },
            /**
             * Начальное значение компонента.
             */
            value: {
                type: String,
                required: false
            },
            /**
             * Данный параметр указывает компоненту на
             * необходимость удаления введенных данных
             * в input после нажатия пользователем клавиши Enter. 
             */
            clearAfterProcess: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        watch: {
            /**
             * Родительский компонент заново передал данные.
             */
            value() {
                this.currentValue = this.value;
                this.captionDeposed = true;
            }
        },
        data() {
            return {
                focused: false,                                    // {boolean} индикатор того, что input находится в фокусе в текущий момент
                captionDeposed: this.value ? true : false,         // {boolean} индикатор необходимости добавления класса "deposed" элементу span
                currentValue: this.value ? this.value : undefined, // {string} текущее значение компонента
            }
        },
        computed: {
            inputListeners() {
                let vm = this;
                
                return Object.assign({},
                    // добавим все слушатели на компоненте
                    this.$listeners,
                    // добавим собственный слушатель, обеспечив работоспособность v-model на компоненте
                    {
                        input(event) {
                            vm.$emit("input", event.target.value);
                        }
                    }
                )
            }
        },
        methods: {
            /**
             * Обрабатывает фокусировку на input.
             */
            processFocus() {
                this.focused = true;

                if (this.caption && !this.currentValue) this.captionDeposed = true;
            },
            /**
             * Обрабатывает снятие фокусировки с input.
             */
            processBlur() {
                this.focused = false;

                if (this.caption && !this.currentValue) this.captionDeposed = false;
            },
            /**
             * Указывает родительскому компоненту 
             * обработать поступившие данные.
             */
            processInput() {
                if (this.currentValue) {
                    this.$emit("process-input", this.currentValue);

                    // если требуется очищать содержимое после нажатия Enter
                    if (this.clearAfterProcess) this.currentValue = undefined;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    label {
        position: relative;
        display: block;
        margin: 1.5rem auto;
        border-bottom: 1px solid rgb(230, 230, 230);

        &:last-of-type {
            margin-bottom: .5rem;
        }

        &::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            width: 0;
            height: 1px;
            background-color: rgb(150, 150, 150);
            transform: translateX(-50%);
            transition: .2s ease;
        }

        &.focused::after {
            width: 100%;
        }

        .caption {
            cursor: auto;
            position: absolute;
            bottom: 50%;
            left: 0;
            color:rgb(100, 100, 100);
            transform: translateY(50%);
            transition: .2s ease;

            &.deposed {
                cursor: default;
                bottom: 100%;
                font-size: .8rem;
                color:rgb(150, 150, 150);
                transform: translateY(0);
            }
        }

        input {
            box-sizing: border-box;
            width: 100%;
            padding: .8rem 0;
            outline: none;
            border: none;
            font-size: 1rem;
            font-family: $sans-reg;
        }
    }
</style>
