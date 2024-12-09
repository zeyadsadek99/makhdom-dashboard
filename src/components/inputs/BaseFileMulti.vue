<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
    <!-- :class="dragOver ? 'bg-warning' : 'bg-third'" -->
    <div
      @click.stop
      class="input_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
      v-bind="getRootProps()"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <div
        class="upload border hid_input rounded-xl p-2"
        :class="{
          uploading: uploadPercentage,
          'border-dashed bg-third !cursor-move': dragOver,
        }"
        @dragover="dragOver = true"
        @dragleave="dragOver = false"
      >
        <!-- @change="uploadFile($event.target.files)" -->
        <input
          options=""
          ref="fileRef"
          type="file"
          :id="id"
          class="hidden"
          :accept="accept"
          :multiple="true"
          v-bind="getInputProps()"
        />

        <input type="text" class="hidden" :name="name" v-bind="field" />
        <label
          :for="id"
          class="text-xl text-center p-7 rounded-lg !flex flex-col justify-center items-center gap-3 cursor-pointer"
        >
          <img
            src="@/assets/images/icons/file.png"
            class="mx-auto mb-3"
            alt="Upload"
          />
          <span>
            {{ $t("LABELS.dropFilesHereOrClickToUpload") }}
          </span>
        </label>

        <div class="flex gap-2 pb-7">
          <img src="@/assets/images/icons/file.png" alt="file upload" />
          <div class="flex flex-col flex-1">
            <h5 class="flex items-center justify-between">
              <span
                class="text-[#191D23]"
                v-if="uploadPercentage && !uploadFinshed"
              >
                {{ $t("LABELS.uploadingFile") }}</span
              >
              <div
                class="text-primary font-bold flex items-center gap-2 ms-auto"
                v-if="uploadFinshed"
              >
                <i
                  class="fas fa-check rounded-full bg-[#047857] text-white border p-1"
                ></i>
                <button
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
                  @click.stop="cancelReq"
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
  <div v-if="preview.length" class="flex items-center gap-3 flex-wrap">
    <div v-for="(image, index) in preview" class="relative" :key="index">
      <div
        v-if="deleteUrl && image.id"
        class="absolute flex items-center justify-center border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
      >
        <Deleter
          method="delete"
          :url="deleteUrl + '/' + image.id"
          icon="fas fa-times text-white"
          @remove="remove(index)"
          :id="image.id"
        />
      </div>
      <button
        v-else
        class="absolute border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
        type="button"
        @click="remove(index)"
      >
        <i class="fas fa-times text-white"></i>
      </button>
      <Image
        width="80"
        height="60"
        class="rounded-lg h-[60px] w-[80px] object-cover border"
        image-class="rounded-lg h-[60px] w-[80px] object-cover border-line preview_image"
        :src="image.image || image"
        alt=""
        preview
      />
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
  deleteUrl: {
    required: false,
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
  placeholder: {
    required: true,
  },
  modalName: {
    required: true,
  },
  modalType: {
    required: true,
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
});
const emit = defineEmits(["update:itemValue", "update:image"]);
const preview = ref([]);
const images = ref([]);

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  accept: props.accept,
});

function onDrop(acceptFiles) {
  uploadFile(acceptFiles);
}

const uploadPercentage = ref(0);

const uploadFinshed = ref(false);
const fileRef = ref();

let request = null;

const inputField = useField(props.name);
function uploadFile(files) {
  uploadFinshed.value = false;
  uploadPercentage.value = 0;

  if (props.returnFile) {
    dragOver.value = false;
    files.map((file) => preview.value.push(URL.createObjectURL(file)));
    uploadPercentage.value = 100;
    emit("update:itemValue", preview.value);
    emit("update:image", files);
    inputField.setValue(files);
    uploadFinshed.value = true;
  } else {
    request = axios.CancelToken.source();
    const frmData = new FormData();
    frmData.append("attachment_type", props.modalType);
    files.map((file, index) => frmData.append(`files[${index}]`, file));
    frmData.append("model", props.modalName);
    axios({
      url: "attachments",
      method: "POST",
      data: frmData,
      baseURL: props.baseUrl ? props.baseUrl : axios.defaults.baseURL,
      onUploadProgress: (event) =>
        (uploadPercentage.value = parseInt(
          Math.round((event.loaded / event.total) * 100)
        )),
      cancelToken: request.token,
    })
      .then((res) => {
        dragOver.value = false;
        files.map((file) => preview.value.push(URL.createObjectURL(file)));
        images.value = res.data.data;
        emit("update:itemValue", preview.value);
        emit("update:image", res.data.data);
        inputField.setValue(res.data.data);
        uploadFinshed.value = true;
      })
      .catch((err) => {
        toast.error(err.response?.data.message || t("STATUS.uploadCanceled"));
        dragOver.value = false;
        cancelReq();
      });
  }
}

function cancelReq() {
  if (request) request.cancel();
  uploadPercentage.value = 0;
  preview.value = [];
  images.value = [];

  emit("update:itemValue", "");
  emit("update:image", "");

  getInputProps().ref.value.value = null;
  request = null;
  inputField.setValue("");
}
const dragOver = ref(false);

function remove(index) {
  preview.value.splice(index, 1);
  images.value.splice(index, 1);

  if (!preview.value.length) {
    cancelReq();
  } else {
    emit("update:itemValue", preview.value);
    emit("update:image", images.value);
    inputField.setValue(images.value);
  }
}
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
