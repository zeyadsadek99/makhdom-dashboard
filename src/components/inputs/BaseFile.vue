<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
    <!-- :class="dragOver ? 'bg-warning' : 'bg-third'" -->

    <div
      class="input_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
      v-bind="getRootProps()"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <div
        class="upload border border-primary hid_input rounded-xl p-2 bg-primary/10"
        :class="{
          uploading: uploadPercentage,
          'border-dashed bg-third !cursor-move': dragOver,
        }"
        @dragover="dragOver = true"
        @dragleave="dragOver = false"
      >
        <input
          ref="refFile"
          type="file"
          :id="id"
          @change="uploadFile($event.target.files)"
          class="hidden"
          :accept="accept"
          :multiple="multiple ? true : false"
        />

        <input type="text" class="hidden" :name="name" v-bind="field" />
        <label
          :for="id"
          class="text-xl text-center p-7 rounded-lg !flex flex-col justify-center items-center gap-3 cursor-pointer"
        >
          <img
            width="180"
            height="180"
            class="mx-auto w-[180px] h-[180px] object-cover"
            v-if="preview && no_preview"
            :src="preview"
            @error="imgError(imgErrors)"
            alt=""
          />
          <template v-else>
            <img
              src="@/assets/images/icons/file.png"
              class="mx-auto mb-3"
              alt="Upload"
            />
            <span class="text-sm">
              {{ $t("LABELS.dropFilesHereOrClickToUpload") }}
            </span>
          </template>
        </label>

        <div class="flex gap-2 pb-7">
          <img src="@/assets/images/icons/file.png" alt="file upload" />
          <div class="flex flex-col flex-1">
            <h5 class="flex items-center justify-between">
              <span class="text-[#191D23]">
                {{ $t("LABELS.uploadingFile") }}</span
              >
              <div
                class="text-primary font-bold flex items-center gap-2"
                v-if="uploadFinshed"
              >
                <i
                  class="fas fa-check rounded-full bg-[#047857] text-white border p-1"
                ></i>
                <button
                  type="button"
                  @click="cancelReq"
                  class="text-primary border w-6 h-6 rounded-full border-primary transition hover:bg-primary hover:!text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div
                class="text-primary font-bold flex items-center gap-2"
                v-if="uploadPercentage && !uploadFinshed"
              >
                <span class="text-primary font-bold">
                  {{ uploadPercentage + "%" }}
                </span>

                <button
                  type="button"
                  @click="cancelReq"
                  class="text-primary border w-6 h-6 rounded-full border-primary transition hover:bg-primary hover:!text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </h5>
            <div class="rounded-lg h-1 w-full bg-[#E7EAEE] mt-auto">
              <div
                class="h-2 rounded-lg bg-[#047857] transition"
                :style="`width:${uploadPercentage}%;`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-error"
      />
    </div>
  </VeeField>
  <div
    v-if="preview && !no_preview && !notPreview"
    class="flex items-center gap-3 flex-wrap"
  >
    <div class="relative">
      <button
        class="absolute border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
        type="button"
        @click="cancelReq"
      >
        <i class="fas fa-times text-white"></i>
      </button>
      <Image
        width="80"
        height="60"
        class="rounded-lg h-[60px] w-[80px] object-cover border"
        image-class="rounded-lg h-[60px] w-[80px] object-cover border-line preview_image"
        :src="preview"
        alt=""
        preview
      >
      </Image>
    </div>
  </div>
</template>

<script setup>
import Image from "primevue/image";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useDropzone } from "vue3-dropzone";
import { useI18n } from "vue-i18n";

import { useField } from "vee-validate";

const { t } = useI18n();
const props = defineProps({
  accept: {
    required: false,
  },

  no_preview: {
    required: false,
    default: false,
  },
  itemValue: {
    required: true,
  },
  image: {
    required: true,
  },
  id: {
    required: true,
  },
  name: {
    required: true,
  },
  label: {
    required: false,
  },
  imgErrors: {
    required: false,
  },
  placeholder: {
    required: true,
  },
  modalName: {
    required: true,
  },
  modalType: {
    required: true,
  },
  notPreview: {
    required: false,
  },

  multiple: {
    type: Boolean,
  },
  returnFile: {
    required: false,
  },
  baseUrl: {
    required: false,
  },
  attachment: {
    required: false,
    default: "attachments",
  },
});
const emit = defineEmits(["update:itemValue", "update:image", "uploading"]);
const preview = ref(null);

const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });
function onDrop(acceptFiles, rejectReasons) {
  uploadFile(acceptFiles[0]);
}

const uploadPercentage = ref(0);
const uploadFinshed = ref(false);
const refFile = ref();
let request = null;

const inputField = useField(props.name);

function uploadFile(files) {
    uploadPercentage.value = 0;
  if (files.length === 0) return;  // Avoid processing if no files are selected.

  if (props.returnFile) {
    dragOver.value = false;
    preview.value = URL.createObjectURL(files[0]);  // Just take the first file for preview (optional).
    uploadPercentage.value = 100;
    emit("update:itemValue", preview.value);
    emit("update:image", files);
    inputField.setValue(files);

    uploadFinshed.value = true;
  } else {
    request = axios.CancelToken.source();
    const frmData = new FormData();
    Array.from(files).forEach((file) => frmData.append("file", file));  // Append all selected files.

    frmData.append("model", props.modalName.trim());
    frmData.append("attachment_type", props.modalType);
    emit("uploading", true);

    axios({
      url: props.attachment,
      method: "POST",
      data: frmData,
      baseURL: props.baseUrl ? props.baseUrl : import.meta.env.VITE_GENERAL_URL,
      onUploadProgress: (event) =>
        (uploadPercentage.value = parseInt(Math.round((event.loaded / event.total) * 100))),
      cancelToken: request.token,
    })
      .then((res) => {
        dragOver.value = false;
        preview.value = URL.createObjectURL(files[0]);  // Again, show the first file's preview.

        emit("update:itemValue", preview.value);
        emit("update:image", res.data.data);
        emit("uploading", false);
        inputField.setValue(res.data.data);
        uploadFinshed.value = true;
      })
      .catch((err) => {
        emit("uploading", false);
        toast.error(err.response?.data.message || t("STATUS.uploadCanceled"));
        dragOver.value = false;
        cancelReq();
      });
  }
}

function cancelReq() {
  if (request) request.cancel();
  uploadPercentage.value = 0;
  preview.value = null;
  emit("update:itemValue", "");
  emit("update:image", "");
  refFile.value.value = null;
  request = null;
  inputField.setValue("");
}
const dragOver = ref(false);
watch(
  () => props.itemValue,
  (newVal) => {
    if (newVal) {
      preview.value = props.itemValue;
    }
  },
  {
    deep: true,
  }
);
onMounted(() => {
  if (props.itemValue) {
    preview.value = props.itemValue;
  }
});
</script>

<style lang="scss">
.input_wrapper {
  &.upload_image {
    margin-bottom: 1.5rem;
    input {
      display: none;
    }
    label {
      cursor: pointer;
      max-width: 300px;

      margin-inline: auto;
      img {
        height: 200px;
        object-fit: cover;
        width: 100%;
        border-radius: 1rem;
      }
    }
  }
  .upload {
    > div {
      @apply hidden;
    }
    &.uploading {
      input {
        @apply hidden;
      }
      > div {
        @apply flex;
      }
    }
    &.hid_input {
      input {
        @apply hidden;
      }
      &.uploading {
        // > label {
        //   @apply hidden;
        // }
      }
    }
  }
}
</style>
