/*
 * 補助專區畫面：讀取 subsidy/data/*.json 的內容並產生頁面。
 * 內容請用 Pages CMS 後台編輯（設定在 .pages.yml），不需要改這個檔案。
 */
(function ($) {
  var CATEGORY_ORDER = ["辦法", "簡章", "申請表格", "其他"];
  var CHECK_KEY = "kehua-subsidy-checklist";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function link(url, text, cls) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener"' +
      (cls ? ' class="' + cls + '"' : "") + ">" + esc(text) + "</a>";
  }

  function asList(v) {
    if (!v) return [];
    return $.isArray(v) ? v : [v];
  }

  // 後台存檔後要馬上看到新內容，所以不用瀏覽器快取
  function load(name) {
    return $.ajax({ url: "subsidy/data/" + name + ".json", dataType: "json", cache: false });
  }

  function failed($el) {
    $el.html('<p class="sub-pending">內容讀取失敗，請重新整理頁面。</p>');
  }

  function readChecked() {
    try { return JSON.parse(localStorage.getItem(CHECK_KEY)) || {}; } catch (e) { return {}; }
  }

  function saveChecked(state) {
    try { localStorage.setItem(CHECK_KEY, JSON.stringify(state)); } catch (e) { /* 無法儲存時只影響勾選紀錄 */ }
  }

  function renderNews(data) {
    var list = (data.items || []).slice().sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    var $list = $("#sub-news-list");
    if (!list.length) {
      $list.append('<li class="sub-pending">目前沒有公告。</li>');
      return;
    }
    $.each(list, function (i, n) {
      var body = esc(n.content);
      var links = $.grep(n.links || [], function (l) { return l && l.url; });
      if (links.length) {
        body += '<div class="sub-news-links">' + $.map(links, function (l) {
          return link(l.url, l.text || l.url);
        }).join("") + "</div>";
      }
      $list.append(
        '<li class="sub-news-item">' +
        '<button type="button" class="sub-news-head" aria-expanded="false" aria-controls="sub-news-' + i + '">' +
        '<span class="sub-news-date">' + esc(n.date) + "</span>" +
        '<span class="sub-news-title">' + esc(n.title) + "</span>" +
        '<span class="sub-news-toggle" aria-hidden="true">+</span></button>' +
        '<div class="sub-news-body" id="sub-news-' + i + '">' + body + "</div></li>"
      );
    });
    $list.on("click", ".sub-news-head", function () {
      var $item = $(this).closest(".sub-news-item").toggleClass("open");
      $(this).attr("aria-expanded", $item.hasClass("open") ? "true" : "false");
      $item.find(".sub-news-body").slideToggle(300);
    });
  }

  function paragraphs(text) {
    return $.map(String(text || "").split(/\n\s*\n/), function (p) {
      return p.trim() ? "<p>" + esc(p.trim()) + "</p>" : null;
    }).join("");
  }

  function renderHero(data) {
    var a = data.apply || {};
    if (data.programName) {
      document.title = data.programName + "｜補助專區 - 科華文教基金會";
    }
    $("#sub-tagline").text(data.tagline || "");
    if (a.period || a.dates) {
      $("#sub-hero-period").html(
        "<strong>" + esc(a.period) + (a.open ? " 申請中" : "") + "</strong>" +
        (a.dates ? "申請期間 " + esc(a.dates) : "")
      );
    }
    // 主視覺圖片已含計畫名稱；後台清空圖片時，改顯示文字版標題
    if (data.heroImage) {
      $("#sub-hero-img").attr("src", data.heroImage);
      $("#sub-hero-mobile-src").attr("srcset", data.heroImageMobile || data.heroImage);
    } else if (data.heroImage === "") {
      $("#sub-hero-visual").remove();
      $("#sub-hero-text").removeClass("sub-sr-only");
    }
  }

  function renderIntro(data) {
    $("#sub-intro-text").html(paragraphs(data.intro));

    var $points = $("#sub-points-list");
    $.each(data.points || [], function (i, p) {
      var title = String(p.title || "");
      var cls = /^A\s*類/.test(title) ? " is-a" : /^B\s*類/.test(title) ? " is-b" : "";
      $points.append(
        '<div class="sub-point' + cls + '"><h3>' + esc(title) + "</h3><p>" + esc(p.content) + "</p></div>"
      );
    });
    if (!(data.points || []).length) $("#sub-points").hide();

    var $steps = $("#sub-timeline-list");
    $.each(data.timeline || [], function (i, s) {
      $steps.append(
        '<li class="sub-step"><div class="sub-step-date">' + esc(s.date) + "</div>" +
        '<div class="sub-step-label">' + esc(s.label) + "</div>" +
        (s.note ? '<div class="sub-step-note">' + esc(s.note) + "</div>" : "") + "</li>"
      );
    });
    if (!(data.timeline || []).length) $("#sub-timeline").hide();

    renderChecklist(data);
  }

  function renderChecklist(data) {
    var items = data.checklist || [];
    if (!items.length) { $("#sub-checklist").hide(); return; }
    var state = readChecked();
    var $list = $("#sub-checklist-list");
    $.each(items, function (i, c) {
      var key = String(c.item || i);
      $list.append(
        '<li class="sub-check-item"><button type="button" class="sub-check-btn" role="checkbox" aria-checked="' +
        (state[key] ? "true" : "false") + '" data-key="' + esc(key) + '">' +
        '<span class="sub-check-box" aria-hidden="true"></span>' +
        '<span class="sub-check-text"><strong>' + esc(c.item) + "</strong>" +
        (c.note ? "<span>" + esc(c.note) + "</span>" : "") + "</span></button></li>"
      );
    });
    $list.on("click", ".sub-check-btn", function () {
      var on = $(this).attr("aria-checked") !== "true";
      $(this).attr("aria-checked", on ? "true" : "false");
      var s = readChecked();
      if (on) s[$(this).data("key")] = true; else delete s[$(this).data("key")];
      saveChecked(s);
    });
    $("#sub-checklist-note").text(data.checklistNote || "").toggle(!!data.checklistNote);
  }

  function renderApply(data) {
    var a = data.apply || {};
    var html;
    if (a.open) {
      html = '<p class="sub-apply-status">' + esc(a.period) + " 開放申請中</p>";
      if (a.dates) html += '<p class="sub-apply-dates">申請期間：' + esc(a.dates) + "</p>";
      if (a.note) html += '<p class="sub-apply-text">' + esc(a.note) + "</p>";
      html += '<div class="sub-apply-actions">' +
        (a.applyUrl
          ? link(a.applyUrl, "前往線上申請", "sub-btn sub-btn-primary")
          : '<span class="sub-apply-wait">線上申請連結準備中</span>') +
        '<a class="sub-btn sub-btn-ghost" href="#sub-downloads">下載簡章與表格</a></div>';
    } else {
      html = '<p class="sub-apply-status">' + esc(a.period ? a.period + " 尚未開放申請" : "目前非申請期間") + "</p>";
      if (a.dates) html += '<p class="sub-apply-dates">申請期間：' + esc(a.dates) + "</p>";
      if (a.closedText) html += '<p class="sub-apply-text">' + esc(a.closedText) + "</p>";
      html += '<div class="sub-apply-actions"><a class="sub-btn sub-btn-primary" href="#sub-downloads">下載簡章與表格</a></div>';
    }
    $("#sub-apply-box").html(html);
  }

  function renderContact(data) {
    var c = data.contact || {};
    if (!c.phone && !c.email) { $("#sub-contact").hide(); return; }
    $("#sub-contact-info").html(
      (c.name ? "<div><strong>" + esc(c.name) + "</strong></div>" : "") +
      (c.phone ? '<div>電話 <a href="tel:' + esc(String(c.phone).replace(/[^\d+]/g, "")) + '">' + esc(c.phone) + "</a></div>" : "") +
      (c.email ? '<div>信箱 <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a></div>" : "")
    );
  }

  function renderPage(data) {
    renderHero(data);
    renderIntro(data);
    renderApply(data);
    renderContact(data);
  }

  function renderResults(data) {
    if (!data.visible) return;
    var $list = $("#sub-results-list");
    $.each(data.items || [], function (i, it) {
      var title = it.url ? link(it.url, it.title) : esc(it.title);
      $list.append(
        '<div class="sub-result"><span class="sub-result-year">' + esc(it.year) + "</span>" + title +
        (it.content ? '<div style="white-space:pre-line">' + esc(it.content) + "</div>" : "") + "</div>"
      );
    });
    $("#sub-results").prop("hidden", false);
  }

  function fileFormat(path) {
    var m = /\.([a-z0-9]+)$/i.exec(String(path).split("?")[0]);
    return m ? m[1].toUpperCase() : "檔案";
  }

  function renderDownloads(data) {
    var list = data.items || [];
    var $list = $("#sub-downloads-list");
    if (!list.length) {
      $list.append('<p class="sub-pending">目前沒有可下載的檔案。</p>');
      return;
    }
    var groups = {}, order = CATEGORY_ORDER.slice();
    $.each(list, function (i, d) {
      var c = d.category || "其他";
      if ($.inArray(c, order) < 0) order.push(c);
      (groups[c] = groups[c] || []).push(d);
    });
    $.each(order, function (i, c) {
      if (!groups[c]) return;
      var rows = $.map(groups[c], function (d) {
        var files = asList(d.files);
        var buttons = files.length
          ? $.map(files, function (f) {
              return '<a href="' + esc(f) + '" target="_blank" rel="noopener" download aria-label="下載 ' +
                esc(d.name) + "（" + esc(fileFormat(f)) + '）">' + esc(fileFormat(f)) + "</a>";
            }).join("")
          : "<span>檔案準備中</span>";
        return '<div class="sub-dl-row"><div class="sub-dl-name">' + esc(d.name) + "</div>" +
          '<div class="sub-dl-files">' + buttons + "</div></div>";
      }).join("");
      $list.append('<div class="sub-dl-group"><h3 class="sub-dl-category">' + esc(c) + "</h3>" + rows + "</div>");
    });
  }

  function bindMobileMenu() {
    $(".sub-mob-menu-btn").on("click", function () {
      var open = $("#sub-mob-menu").toggleClass("open").hasClass("open");
      $(this).attr("aria-expanded", open ? "true" : "false");
      $(this).find("img").attr("src", open ? "/images/icon-close1a-66x66.png?v=2" : "/images/icon-menu1a-66x66.png?v=2");
    });
  }

  $(function () {
    bindMobileMenu();
    load("news").done(renderNews).fail(function () { failed($("#sub-news-list")); });
    load("page").done(renderPage).fail(function () { failed($("#sub-intro-text")); failed($("#sub-apply-box")); });
    load("results").done(renderResults);
    load("downloads").done(renderDownloads).fail(function () { failed($("#sub-downloads-list")); });
  });
})(jQuery);
