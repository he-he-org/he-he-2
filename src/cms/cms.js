// Your module must at least include these three imports
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

// Let's say you've created widget and preview components for a custom image
// gallery widget in separate files
import I18nWidget from "./I18nWidget";
import I18nPreview from "./I18nPreview";
import StringListWidget from "./StringListWidget.js";
import StringListPreview from "./StringListPreview.js";
//
// // Register the imported widget:
CMS.registerWidget("i18n", I18nWidget, I18nPreview);
CMS.registerWidget("string_list", StringListWidget, StringListPreview);

const backend = {
  name: "git-gateway",
  branch: "master"
};

CMS.init({
  config: {
    backend
  }
});
