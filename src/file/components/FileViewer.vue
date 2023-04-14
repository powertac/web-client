<script lang="ts" setup>
import type FileNode from "@/file/domain/FileNode";
import {computed, onMounted, ref} from "vue";
import {api} from "@/api";

const props = defineProps<{
    file: FileNode
}>();

const content = ref<string>();
const lines = computed(() => undefined !== content.value
        ? content.value.split(/\r\n|\r|\n/)
        : []);

onMounted(() => api.orchestrator.files.getFileContents(props.file.path)
    .then((c) => content.value = c)
    .catch((error) => console.error("could not load file contents for ", props.file.path, error)));
</script>

<template>
    <div class="overflow-scroll py-2">
        <table class="file-contents w-auto" v-if="content !== undefined">
            <tr v-for="(line, index) in lines" :key="index">
                <th>{{index + 1}}</th>
                <td><pre v-text="line"></pre></td>
            </tr>
        </table>
        <div class="text-center py-16" v-else>
            <icon class="text-4xl text-slate-500" icon="circle-notch" :spin="true" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.file-viewer {
    //-webkit-user-select: none;
}
div.file-contents {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex-grow: 1;
    overflow: auto;
    background: #fdf6e3;
}
div.filler {
    flex-grow: 1;
}
table {
    @apply bg-white text-slate-700;
    font-family: "Inconsolata", monospace;
    //background: #fdf6e3;
    margin: 0;
    padding: 1rem;
    //color: #657b83;
    line-height: 1.33;
    overflow-y: scroll;
    width: 100%;
    position: relative;
    //border-bottom: 1px solid #eee8d5;
    th {
        @apply text-slate-500 bg-white;
        position: sticky;
        left: 0;
        //background: #eee8d5;
        font-weight: normal;
        -webkit-user-select: none;
        text-align: right;
        padding: .1rem 1rem;
    }
    td {
        padding: .1rem 1rem;
        pre {
            padding: 0;
            margin: 0;
        }
    }
    tr:hover {
        td {

        }
    }
}
div.no-file-placeholder, div.file-loading {
    display: flex;
    flex-grow: 1;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: #FAFAF9; // stone 50
    color: #475569;
}
div.file-loading {
    font-size: 2rem;
}
</style>
