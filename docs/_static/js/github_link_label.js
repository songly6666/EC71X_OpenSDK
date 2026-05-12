/**
 * GitHub Link Label Override
 *
 * Replaces the default RTD theme GitHub action text without changing
 * the destination URL or click behavior.
 */

(function () {
  "use strict";

  function updateGitHubLinkLabel() {
    var selectors = [
      '.wy-breadcrumbs-aside a[href*="github.com"]',
      'a[href*="github.com"].fa',
    ];

    selectors.forEach(function (selector) {
      var links = document.querySelectorAll(selector);
      links.forEach(function (link) {
        var text = (link.textContent || "").trim();
        if (
          text === "Edit on GitHub" ||
          text === "\u5728GitHub\u4e0a\u7f16\u8f91" ||
          text === "\u5728Github\u4e0a\u7f16\u8f91"
        ) {
          link.textContent = "\u8df3\u8f6c\u5230GitHub";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateGitHubLinkLabel);
  } else {
    updateGitHubLinkLabel();
  }
})();
