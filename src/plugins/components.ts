import BaseButton from "@/components/inputs/BaseButton.vue";
import BaseInput from "@/components/inputs/BaseInput.vue";
import BaseDate from "@/components/inputs/BaseDate.vue";
import BaseEditor from "@/components/inputs/BaseEditor.vue";
import BaseFile from "@/components/inputs/BaseFile.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import NotFound from "@/views/NotFound.vue";
import BackError from "@/views/Error.vue";
import GlobalError from "@/components/GlobalError.vue";
import InputIcon from "@/components/InputIcon.vue";
import BaseInputColor from "@/components/inputs/BaseInputColor.vue";
import BaseFileMulti from "@/components/inputs/BaseFileMulti.vue";
import BasePassword from "@/components/inputs/BasePassword.vue";
import BasePhone from "@/components/inputs/BasePhone.vue";
import BaseSelect from "@/components/inputs/BaseSelect.vue";
import BaseCheckbox from "@/components/inputs/BaseCheckbox.vue";
import Select from "@/components/inputs/Select.vue";
import AvailabilitySelect from "@/components/inputs/AvailabilitySelect.vue";
import NoramlSelect from "@/components/inputs/NoramlSelect.vue";
import AddNew from "@/components/global/AddNew.vue";
import BreadCrumbs from "@/components/global/BreadCrumbs.vue";
import BasePagination from "@/components/global/BasePagination.vue";
import BaseCard from "@/components/cards/BaseCard.vue";
import BaseCard1 from "@/components/cards/BaseCard1.vue";
import BaseForm from "@/components/core/BaseForm.vue";
import StateCard from "@/components/cards/StateCard.vue";
import Switcher from "@/components/inputs/Switcher.vue";
import SmallDetailsCard from "@/components/cards/SmallDetailsCard.vue";
import Modal from "@/components/global/Modal.vue";
import Restore from "@/components/global/Restore.vue";
import Deleter from "@/components/global/Deleter.vue";
import ConfirmModal from "@/components/global/ConfirmModal.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import FormSkelton from "@/components/skelton/FormSkelton.vue";
import NotificationModal from "@/components/global/NotificationModal.vue";
import ActionMenu from "@/components/menus/ActionMenu.vue";
import BaseFilter from "@/components/filters/BaseFilter.vue";
import BaseSideFilter from "@/components/filters/BaseSideFilter.vue";
import Loader from "@/components/Loader.vue";
import SectionLoader from "@/components/SectionLoader.vue";
import GlobalSwitcher from "@/components/inputs/GlobalSwitcher.vue";
import MultiArchive from "@/components/global/MultiArchive.vue";
import MultiSelect from "@/components/global/MultiSelect.vue";
import Tooltip from "primevue/tooltip";
import BaseChoices from "@/components/inputs/BaseChoices.vue";
import BaseQuantity from "@/components/inputs/BaseQuantity.vue";
import SelectDateTime from "@/components/inputs/SelectDateTime.vue";
import type { App } from "vue";

export async function registerComponents(app: App) {
  app.component("BaseQuantity", BaseQuantity);
  app.component("BaseChoices", BaseChoices);
  app.directive('tooltip', Tooltip);
  app.component("MultiSelect", MultiSelect);
  app.component("MultiArchive", MultiArchive);
  app.component("GlobalSwitcher", GlobalSwitcher);
  app.component("base-filter", BaseFilter);
  app.component("section-title", SectionTitle);
  app.component("GlobalError", GlobalError);
  app.component("NotFound", NotFound);
  app.component("BackError", BackError);
  app.component("action-menu", ActionMenu);
  app.component("Loader", Loader);
  app.component("SectionLoader", SectionLoader);
  app.component("SvgIcon", SvgIcon);
  app.component("InputIcon", InputIcon);
  app.component("notify", NotificationModal);
  app.component("FormSkelton", FormSkelton);
  app.component("Switcher", Switcher);
  app.component("BaseButton", BaseButton);
  app.component("Restore", Restore);
  app.component("Deleter", Deleter);
  app.component("ConfirmModal", ConfirmModal);
  app.component("BaseInput", BaseInput);
  app.component("BaseEditor", BaseEditor);
  app.component("BaseDate", BaseDate);
  app.component("BaseFile", BaseFile);
  app.component("BaseInputColor", BaseInputColor);
  app.component("BaseSideFilter", BaseSideFilter);
  app.component("BaseFileMulti", BaseFileMulti);
  app.component("BasePassword", BasePassword);
  app.component("BasePhone", BasePhone);
  app.component("BaseSelect", BaseSelect);
  app.component("BaseCheckbox", BaseCheckbox);
  app.component("SingleSelect", Select);
  app.component("AvailabilitySelect", AvailabilitySelect);
  app.component("NoramlSelect", NoramlSelect);
  app.component("add-new", AddNew);
  app.component("breadcrumbs", BreadCrumbs);
  app.component("BasePagination", BasePagination);
  app.component("base-card", BaseCard);
  app.component("base-card1", BaseCard1);
  app.component("base-form", BaseForm);
  app.component("state-card", StateCard);
  app.component("Modal", Modal);
  app.component("small-details-card", SmallDetailsCard);
  app.component("SelectDateTime", SelectDateTime);
}
