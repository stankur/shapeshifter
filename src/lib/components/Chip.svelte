<script lang="ts">
    interface Props {
        label: string;
        onclick: () => void;
    }
    let {label, onclick}: Props = $props();

</script>

<div {onclick} class="h-fit w-fit rounded-md p-2 text-xs bg-black text-white cursor-pointer">
    {label}
</div>
