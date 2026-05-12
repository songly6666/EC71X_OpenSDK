/**
 * Model Switcher
 *
 * Adds a model selector to the upper-left RTD sidebar.
 */

(function () {
  "use strict";

  var DEFAULT_CONFIG = {
    currentModel: "CAT1.bis_OpenCPU",
    preservePath: true,
    languages: ["en", "zh_CN"],
    models: [
      {
        name: "CAT1.bis_OpenCPU",
        label: "CAT1.bis_OpenCPU",
        url: "https://your-domain.com/ec71x",
      },
    ],
  };

  function mergeConfig(config) {
    var result = {};
    var key;

    for (key in DEFAULT_CONFIG) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key)) {
        result[key] = DEFAULT_CONFIG[key];
      }
    }

    config = config || {};
    for (key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        result[key] = config[key];
      }
    }

    if (!Array.isArray(result.models)) {
      result.models = DEFAULT_CONFIG.models;
    }
    if (!Array.isArray(result.languages)) {
      result.languages = DEFAULT_CONFIG.languages;
    }

    return result;
  }

  var CONFIG = mergeConfig(window.DOC_MODEL_SWITCHER);

  function getPathParts() {
    return window.location.pathname.split("/").filter(Boolean);
  }

  function getLanguageIndex(parts) {
    for (var i = 0; i < parts.length; i++) {
      if (CONFIG.languages.indexOf(parts[i]) !== -1) {
        return i;
      }
    }
    return -1;
  }

  function getCurrentLanguage(parts) {
    var languageIndex = getLanguageIndex(parts);
    if (languageIndex !== -1) {
      return parts[languageIndex];
    }
    return CONFIG.languages[0] || "en";
  }

  function getPathAfterLanguage(parts) {
    var languageIndex = getLanguageIndex(parts);
    if (languageIndex === -1 || !CONFIG.preservePath) {
      return ["index.html"];
    }

    var rest = parts.slice(languageIndex + 1);
    if (rest.length === 0) {
      return ["index.html"];
    }
    return rest;
  }

  function trimSlashes(value) {
    return String(value || "").replace(/^\/+|\/+$/g, "");
  }

  function joinUrl(baseUrl, pathParts) {
    var url = String(baseUrl || "").replace(/\/+$/g, "");
    var path = pathParts.map(trimSlashes).filter(Boolean).join("/");
    return url + "/" + path;
  }

  function resolveBaseUrl(model) {
    var url = model.url || "";

    if (!/^https?:\/\//i.test(url)) {
      console.warn("Model switcher requires a full URL for model:", model);
      return "";
    }

    return url;
  }

  function getTargetUrl(model) {
    var parts = getPathParts();
    var language = getCurrentLanguage(parts);
    var pagePath = getPathAfterLanguage(parts);
    var targetBase = resolveBaseUrl(model);
    var targetPath = [language].concat(pagePath);

    if (!targetBase) {
      return "";
    }

    return joinUrl(targetBase, targetPath) + window.location.search + window.location.hash;
  }

  function createOption(model) {
    var option = document.createElement("option");
    option.value = model.name || model.label || model.url;
    option.textContent = model.label || model.name || model.url;
    option.dataset.targetUrl = getTargetUrl(model);

    if (option.value === CONFIG.currentModel || model.current) {
      option.selected = true;
    }

    return option;
  }

  function createSwitcher() {
    var container = document.createElement("div");
    container.className = "model-switcher";

    var label = document.createElement("label");
    label.className = "model-switcher__label";
    label.setAttribute("for", "model-switcher-select");
    label.textContent = "利尔达LTE代码";
    container.appendChild(label);

    var select = document.createElement("select");
    select.id = "model-switcher-select";
    select.className = "model-switcher__select";

    CONFIG.models.forEach(function (model) {
      select.appendChild(createOption(model));
    });

    select.addEventListener("change", function () {
      var selected = select.options[select.selectedIndex];
      if (selected && selected.dataset.targetUrl) {
        window.location.href = selected.dataset.targetUrl;
      }
    });

    container.appendChild(select);
    return container;
  }

  function init() {
    if (!CONFIG.models || CONFIG.models.length === 0) {
      return;
    }

    var sidebarSearch = document.querySelector(".wy-side-nav-search");
    if (!sidebarSearch || document.querySelector(".model-switcher")) {
      return;
    }

    sidebarSearch.appendChild(createSwitcher());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
