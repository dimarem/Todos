<template>
    <label>
        <input 
            :checked="content.done"
            :name="content.description"
            @change="$emit('change', $event.target.checked, index)"
            type="checkbox"
        >
        <svg viewBox="0 0 1280.000000 959.000000"><g transform="translate(0.000000,959.000000) scale(0.100000,-0.100000)"><path d="M12252 9569 c-35 -10 -87 -31 -116 -48 -30 -16 -1843 -1223 -4030 -2680 -2188 -1458 -3980 -2651 -3984 -2651 -4 0 -776 579 -1717 1286 -1109 834 -1733 1297 -1775 1318 -61 29 -72 31 -180 31 -109 0 -119 -2 -183 -32 -79 -38 -163 -114 -200 -181 -37 -68 -70 -197 -63 -242 20 -124 8 -105 1895 -3170 1261 -2047 1866 -3021 1899 -3057 74 -78 245 -151 329 -140 122 16 214 61 304 147 37 36 524 547 1081 1135 557 589 2361 2492 4008 4230 1647 1738 3039 3207 3093 3264 107 113 143 174 172 289 18 70 18 74 0 145 -26 106 -63 175 -125 237 -63 62 -118 92 -220 121 -83 23 -105 23 -188 -2z"/></g></svg>
        <!-- текстовая подпись чекбокса -->
        <span class="description">{{ content.description }}</span>
        <!-- контрольные элементы чекбокса -->
        <span class="controls">
            <!-- кнопка для редактирования текстовой подписи чекбокса -->
            <button @click="$emit('edit', content.description, index)">
                <svg viewBox="0 0 383.947 383.947"><g><polygon points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893"/><path d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04 C386.027,77.92,386.027,64.373,377.707,56.053z"/></g></svg>
            </button>
            <!-- кнопка для удаления текущего чекбокса -->
            <button @click="$emit('remove', index)">
                <svg viewBox="0 0 515.556 515.556"><path d="m64.444 451.111c0 35.526 28.902 64.444 64.444 64.444h257.778c35.542 0 64.444-28.918 64.444-64.444v-322.222h-386.666z"/><path d="m322.222 32.222v-32.222h-128.889v32.222h-161.111v64.444h451.111v-64.444z"/></svg>
            </button>
        </span>
    </label>
</template>

<script>
    /**
     * Данный компонент формирует стилизованный checkbox.
     * 
     * @example
     * <Checkbox name="чекбокс" content="содержимое чекбокса" checked="false"/>
     */
    export default {
        model: {
            prop: "checked",
            event: "change"
        },
        props: {
            /**
             * Содержание чекбокса.
             */
            content: {
                type: Object,
                required: true
            },
            /**
             * Порядковый номер компонента.
             */
            index: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    label {
        cursor: pointer;
        position: relative;
        display: block;
        margin: 1rem 0;
        padding-right: 100px !important; /* справа размещаются контрольные элементы */

        &::before {
            content: "";
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: -.2rem;
            z-index: 1;
            width: 1.5rem;
            height: 1.5rem;
            background-color: white;
            border-radius: 3px;
            border: 2px solid rgb(50, 50, 50);
        }

        input {
            margin: 0;
            margin-right: 1rem;

            &:checked ~ svg {
                display: block;
            }

            &:checked ~ .description {
                text-decoration: line-through;
            }
        }

        & > svg {
            position: absolute;
            left: .25rem;
            top: .05rem;
            z-index: 1;
            display: none;
            width: 1rem;
            height: 1rem;
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

            button {
                cursor: pointer;
                padding: 0;
                border: none;
                outline: none;

                &:not(:last-of-type) {
                    margin-right: 10px;
                }

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
        }
    }
</style>
