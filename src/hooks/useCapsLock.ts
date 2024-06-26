import {onBeforeUnmount, onMounted, ref} from "vue";

export default function () {
    const capsLockFlag = ref(false)

    onMounted(() => {
        console.log('useCapsLock onMounted')
        window.addEventListener('keydown', handleCapsKeydown);
    })

    onBeforeUnmount(() => {
        console.log('useCapsLock onBeforeUnmount')
        window.removeEventListener('keydown', handleCapsKeydown);
    })

    function handleCapsKeydown(event: any) {
        if (event.key !== 'CapsLock') {
            return;
        }
        capsLockFlag.value = !!event.getModifierState('CapsLock');
    }

    return {capsLockFlag};
}