<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true });

export interface IBaseToggleProps {
    trueLabel?: string;
    falseLabel?: string;
}

withDefaults(defineProps<IBaseToggleProps>(), {
    trueLabel: "Вкл",
    falseLabel: "Выкл",
});
</script>

<template>
    <div class="switch">
        <label>
            Выкл
            <input v-model="modelValue" type="checkbox" />
            <span class="lever"></span>
            Вкл
        </label>
    </div>
</template>

<style scoped>
.switch,
.switch * {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.switch label {
    cursor: pointer;
    font-size: 0.8rem;
    color: #9e9e9e;
}

.switch label input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
}

.switch label input[type="checkbox"]:checked + .lever {
    background-color: #84c7c1;
}

.switch label input[type="checkbox"]:checked + .lever:before,
.switch label input[type="checkbox"]:checked + .lever:after {
    left: 18px;
}

.switch label input[type="checkbox"]:checked + .lever:after {
    background-color: #26a69a;
}

.switch label .lever {
    content: "";
    display: inline-block;
    position: relative;
    width: 36px;
    height: 14px;
    background-color: rgba(0, 0, 0, 0.38);
    border-radius: 15px;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
    vertical-align: middle;
    margin: 0 16px;
}

.switch label .lever:before,
.switch label .lever:after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: 0;
    top: -3px;
    -webkit-transition:
        left 0.3s ease,
        background 0.3s ease,
        -webkit-box-shadow 0.1s ease,
        -webkit-transform 0.1s ease;
    transition:
        left 0.3s ease,
        background 0.3s ease,
        box-shadow 0.1s ease,
        transform 0.1s ease,
        -webkit-box-shadow 0.1s ease,
        -webkit-transform 0.1s ease;
}

.switch label .lever:before {
    background-color: #85c7c1;
}

.switch label .lever:after {
    background-color: #f1f1f1;
    -webkit-box-shadow:
        0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12);
    box-shadow:
        0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

input[type="checkbox"]:checked:not(:disabled) ~ .lever:active::before,
input[type="checkbox"]:checked:not(:disabled).tabbed:focus ~ .lever::before {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    background-color: rgba(38, 166, 154, 0.15);
}

input[type="checkbox"]:not(:disabled) ~ .lever:active:before,
input[type="checkbox"]:not(:disabled).tabbed:focus ~ .lever::before {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    background-color: rgba(0, 0, 0, 0.08);
}

.switch input[type="checkbox"][disabled] + .lever {
    cursor: default;
    background-color: rgba(0, 0, 0, 0.12);
}

.switch label input[type="checkbox"][disabled] + .lever:after,
.switch label input[type="checkbox"][disabled]:checked + .lever:after {
    background-color: #949494;
}
</style>
