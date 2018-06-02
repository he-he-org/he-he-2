// Your module must at least include these three imports
import React from "react";
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

// Let's say you've created widget and preview components for a custom image
// gallery widget in separate files
import I18nWidget from "./I18nWidget";
import I18nPreview from "./I18nPreview";

// Register the imported widget:
CMS.registerWidget("i18n", I18nWidget, I18nPreview);
