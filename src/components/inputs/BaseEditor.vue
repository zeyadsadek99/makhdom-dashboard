<template>
  <quill-editor
    v-model="state.content"
    :options="state.editorOption"
    :disabled="state.disabled"
    :placeholder="placeholder"
    :toolbar="state.editorOption.modules.toolbars"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
  />
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { reactive } from "vue";

defineProps({
  placeholder: {
    type: String,
    required: true,
    default: "",
  },
});

const state = reactive({
  content: "<p>2333</p>",
  _content: "",
  editorOption: {
    placeholder: "core",
    modules: {
      toolbars: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
      ],
    },
  },
  disabled: false,
});

function onEditorBlur(quill) {
  console.log("editor blur!", quill);
}

function onEditorFocus(quill) {
  console.log("editor focus!", quill);
}

function onEditorReady(quill) {
  console.log("editor ready!", quill);
}

function onEditorChange({ quill, html, text }) {
  console.log("editor change!", quill, html, text);
  state._content = html;
}
</script>
