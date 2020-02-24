<template>
    <section class="page-404">
        <h1>404</h1>
        <p>Ничего не найдено</p>
    </section>
</template>

<style lang="scss" scoped>
    .page-404 {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: rgb(200, 200, 200);

        h1 {
            margin: 0;
            font-size: 15rem;
            font-family: $sans-bold;
            
            @media screen and (max-width: 500px) {
                font-size: 10rem;
            }

            @media screen and (max-width: 325px) {
                font-size: 7rem;
            }
        }
    }
</style>
