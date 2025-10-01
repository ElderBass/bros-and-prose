<template>
    <AppLayout>
        <PageTitle title="future prose" />
        <h3>i simply haven't made it this far...</h3>
        <p>so...here's an alternate future:</p>
        <div class="video-container">
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/xvZqHgFz51I?si=dEPQXJQ_qUY3N91y"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
</script>

<style scoped>
.video-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

h3 {
    padding: 2rem;
    font-size: 1.5rem;
    color: var(--accent-blue);
    text-align: center;
}

p {
    font-size: 1.25rem;
    color: var(--main-text);
    text-align: center;
}
</style>
