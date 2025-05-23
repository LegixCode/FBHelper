<script setup lang="ts">
import * as OTPAuth from "otpauth";
import BaseBadge from "@/components/Base/BaseBadge.vue";
import BaseInput from "@/components/Base/Inputs/BaseInput.vue";
import ClipboardContent from "@/components/Base/ClipboardContent.vue";
import { onMounted, ref, watch } from "vue";

const secret = ref("");
const secretIsInvalid = ref(false);

const totp = ref<null | OTPAuth.TOTP>();

const token = ref("");
const remaining = ref(0);
const intervalId = ref(null);

function generateToken() {
    clearInterval(intervalId.value);
    if (!secret.value.length) {
        token.value = "";
        return;
    }
    chrome.storage.local.set({
        otp_secret: secret.value,
    });

    totp.value = new OTPAuth.TOTP({
        issuer: "OTPAuth",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret.value,
    });
    token.value = totp.value.generate();
    remaining.value = totp.value.remaining();
    intervalId.value = setInterval(() => {
        let newRemaining = totp.value.remaining();
        if (newRemaining > remaining.value) {
            token.value = totp.value.generate();
        }
        remaining.value = newRemaining;
    }, 1e3);
}

onMounted(() =>
    chrome.storage.local.get(["otp_secret"]).then((result) => {
        if (result.otp_secret) secret.value = result.otp_secret;
    })
);
watch(secret, generateToken);
</script>

<template>
    <div class="px-8">
        <h6 class="text-base">2FA</h6>
        <div class="mt-4 flex items-center gap-3">
            <div class="grow">
                <BaseInput v-model="secret" label="Секретный ключ" />
                <div v-if="secretIsInvalid" class="text-red">Некорректный ключ</div>
            </div>
            <template v-if="token">
                <ClipboardContent :value="token" message="Пароль скопирован" class="text-green">
                    <BaseInput v-model="token" label="Пароль" />
                </ClipboardContent>
                <BaseBadge
                    :label="Math.round(remaining / 1000)"
                    :color="remaining > 5000 ? 'green' : 'red'"
                    class="w-6 text-center text-base"
                />
            </template>
        </div>
    </div>
</template>
