/*
 * 補助專區畫面：讀取 subsidy/data/*.json 的內容並產生頁面。
 * 內容請用 Pages CMS 後台編輯（設定在 .pages.yml），不需要改這個檔案。
 */
(function ($) {
  var CATEGORY_ORDER = ["辦法", "簡章", "申請表格", "其他"];

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
    $el.html('<div class="sub-pending">內容讀取失敗，請稍後再試。</div>');
  }

  function renderNews(data) {
    var list = (data.items || []).slice().sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    var $t = $("#sub-news-list");
    if (!list.length) {
      $t.append('<tr><td class="sub-pending">目前沒有公告。</td></tr>');
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
      $t.append(
        '<tr><td class="sub-news-date" align="right">' + esc(n.date) + "</td>" +
        '<td class="sub-news-title"><a href="javascript:void(0);" data-i="' + i + '">' + esc(n.title) + "</a>" +
        '<div class="sub-news-body" id="sub-news-' + i + '">' + body + "</div></td></tr>"
      );
    });
    $t.on("click", ".sub-news-title > a", function () {
      $("#sub-news-" + $(this).data("i")).slideToggle("slow");
    });
  }

  function renderPage(data) {
    $("#sub-intro-text").text(data.intro || "");

    var a = data.apply || {};
    var $box = $("#sub-apply-box");
    if (!a.open) {
      $box.addClass("sub-apply-closed").html(
        '<div class="sub-apply-status">目前非申請區間</div>' +
        "<div>" + esc(a.closedText) + "</div>"
      );
      return;
    }
    var html = '<div class="sub-apply-status">目前為 ' + esc(a.period) + " 申請區間</div>";
    if (a.dates) html += "<div>申請期間：" + esc(a.dates) + "</div>";
    html += a.applyUrl
      ? link(a.applyUrl, "線上申請", "sub-button")
      : '<div class="sub-pending">線上申請連結準備中</div>';
    html += '<div>申請文件請至<a class="sub-inline" href="#sub-downloads">下載專區</a>查看。</div>';
    if (a.note) html += '<div style="white-space:pre-line;margin-top:8px">' + esc(a.note) + "</div>";
    $box.html(html);
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
    $("#sub-results").show();
  }

  function fileFormat(path) {
    var m = /\.([a-z0-9]+)$/i.exec(String(path).split("?")[0]);
    return m ? m[1].toUpperCase() : "檔案";
  }

  function renderDownloads(data) {
    var list = data.items || [];
    var $list = $("#sub-downloads-list");
    if (!list.length) {
      $list.append('<div class="sub-pending">目前沒有可下載的檔案。</div>');
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
      $list.append('<div class="sub-dl-category">' + esc(c) + "</div>");
      $.each(groups[c], function (j, d) {
        var files = asList(d.files);
        var buttons = files.length
          ? $.map(files, function (f) {
              return '<a href="' + esc(f) + '" target="_blank" rel="noopener" download>' + esc(fileFormat(f)) + " ↓</a>";
            }).join("")
          : "<span>檔案準備中</span>";
        $list.append(
          '<div class="sub-dl-row"><div class="sub-dl-name">' + esc(d.name) + "</div>" +
          '<div class="sub-dl-files">' + buttons + "</div></div>"
        );
      });
    });
  }

  $(function () {
    load("news").done(renderNews).fail(function () { failed($("#sub-news")); });
    load("page").done(renderPage).fail(function () { failed($("#sub-apply-box")); });
    load("results").done(renderResults);
    load("downloads").done(renderDownloads).fail(function () { failed($("#sub-downloads-list")); });
  });
})(jQuery);
