<template>
    <Teleport to="body">
        <Transition name="tag-drawer">
            <div v-if="open" class="backdrop" @click="emit('close')">
                <div
                    class="panel"
                    :class="{ mobile }"
                    @click.stop
                    role="dialog"
                    aria-label="tag picker"
                >
                    <div class="panel-header">
                        <h3 class="panel-title">pick tags</h3>
                        <IconButton
                            :icon="faXmark"
                            :size="mobile ? 'xsmall' : 'small'"
                            color="blue"
                            shadowColor="blue"
                            title="close"
                            :handleClick="() => emit('close')"
                        />
                    </div>

                    <TagPickerPanel
                        :allTags="allTags"
                        :initialTags="modelValue"
                        title="add tags"
                        @cancel="emit('close')"
                        @done="(tags) => emit('update:modelValue', tags)"
                    />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import IconButton from "@/components/ui/IconButton.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TagPickerPanel from "./TagPickerPanel.vue";

defineOptions({ name: "TagPickerDrawer" });

defineProps<{
    open: boolean;
    modelValue: string[];
    allTags: string[];
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "update:modelValue", value: string[]): void;
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 2100;
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    padding: 0;
}

.panel {
    width: 520px;
    max-width: 92vw;
    height: 100%;
    background-color: var(--surface-color);
    border-left: 2px solid var(--accent-blue);
    box-shadow:
        -10px 0 28px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.panel.mobile {
    width: 100%;
    max-width: 100vw;
    height: min(85vh, 720px);
    border-left: none;
    border-top: 2px solid var(--accent-blue);
    border-radius: 1rem 1rem 0 0;
    align-self: flex-end;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.panel-title {
    margin: 0;
    font-family: "Libre Baskerville", serif;
    color: var(--accent-blue);
    font-size: 1.25rem;
}

/* Animations */
.tag-drawer-enter-active,
.tag-drawer-leave-active {
    transition: opacity 180ms ease;
}

.tag-drawer-enter-from,
.tag-drawer-leave-to {
    opacity: 0;
}

/* Slide the panel itself */
.tag-drawer-enter-active .panel,
.tag-drawer-leave-active .panel {
    transition: transform 220ms ease;
}

.tag-drawer-enter-from .panel {
    transform: translateX(24px);
}

.tag-drawer-leave-to .panel {
    transform: translateX(24px);
}

.tag-drawer-enter-from .panel.mobile {
    transform: translateY(24px);
}

.tag-drawer-leave-to .panel.mobile {
    transform: translateY(24px);
}
</style>
