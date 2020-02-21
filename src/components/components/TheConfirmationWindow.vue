<template>
    <section class="confirmation-window">
        <main>
            <header>{{ title }}</header>
            <div class="buttons">
                <button @click="$emit('confirm')">Да</button>
                <button @click="$emit('close')">Отмена</button>
            </div>
        </main>
    </section>
</template>

<script>
    /**
     * Компонент формирующий окно для 
     * подверждения удаления.
     */
    export default {
        props: {
            /**
             * Заголовок окна подтверждения действия
             * в зависимости от контекста его использования.
             */
            title: {
                type: String,
                required: true
            }
        }
    }
</script>

<style lang="scss">
    .confirmation-window {
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

            .buttons {
                position: absolute;
                left: 50%;
                top: 50%;
                display: flex;
                justify-content: center;
                width: 90%;
                transform: translateX(-50%);

                button {
                    cursor: pointer;
                    box-sizing: border-box;
                    width: 90px;
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
