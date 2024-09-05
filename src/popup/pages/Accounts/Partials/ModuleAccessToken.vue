<script setup lang="ts">
import BaseInput from "@/components/Base/Inputs/BaseInput.vue";
import ClipboardContent from "@/components/Base/ClipboardContent.vue";
import { FBStore } from "@/classes/FB/FBStore";

const accessToken = FBStore.self.accessToken;
</script>

<template>
    <ClipboardContent :value="accessToken" message="Токен скопирован">
        <BaseInput :model-value="accessToken" class="mr-3 grow" label="Токен" placeholder="EAA..." />
    </ClipboardContent>
</template>
