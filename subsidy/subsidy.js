/*
 * 補助專區畫面：讀取 subsidy/data.js 的內容並產生頁面。
 * 內容請改 subsidy/data.js，不需要改這個檔案。
 */
(function ($) {
  var data = window.SUBSIDY_DATA || {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function link(url, text, cls) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener"' +
      (cls ? ' class="' + cls + '"' : "") + ">" + esc(text) + "</a>";
  }

  function renderNews() {
    var list = data.news || [];
    var $t = $("#sub-news-list");
    if (!list.length) {
      $t.append('<tr><td class="sub-pending">目前沒有公告。</td></tr>');
      return;
    }
    $.each(list, function (i, n) {
      var body = esc(n.content);
      var links = n.links || [];
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

  function renderIntro() {
    $("#sub-intro-text").text(data.intro || "");
  }

  function renderApply() {
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

  function renderResults() {
    var r = data.results || {};
    if (!r.visible) return;
    var $list = $("#sub-results-list");
    $.each(r.items || [], function (i, it) {
      var title = it.url ? link(it.url, it.title) : esc(it.title);
      $list.append(
        '<div class="sub-result"><span class="sub-result-year">' + esc(it.year) + "</span>" + title +
        (it.content ? '<div style="white-space:pre-line">' + esc(it.content) + "</div>" : "") + "</div>"
      );
    });
    $("#sub-results").show();
  }

  function renderDownloads() {
    var list = data.downloads || [];
    var $list = $("#sub-downloads-list");
    if (!list.length) {
      $list.append('<div class="sub-pending">目前沒有可下載的檔案。</div>');
      return;
    }
    var order = [], groups = {};
    $.each(list, function (i, d) {
      var c = d.category || "其他";
      if (!groups[c]) { groups[c] = []; order.push(c); }
      groups[c].push(d);
    });
    $.each(order, function (i, c) {
      $list.append('<div class="sub-dl-category">' + esc(c) + "</div>");
      $.each(groups[c], function (j, d) {
        var files = $.map(d.files || [], function (f) {
          return f.url
            ? '<a href="' + esc(f.url) + '" target="_blank" rel="noopener" download>' + esc(f.format) + " ↓</a>"
            : '<span title="檔案準備中">' + esc(f.format) + " 準備中</span>";
        }).join("");
        $list.append(
          '<div class="sub-dl-row"><div class="sub-dl-name">' + esc(d.name) + "</div>" +
          '<div class="sub-dl-files">' + files + "</div></div>"
        );
      });
    });
  }

  $(function () {
    renderNews();
    renderIntro();
    renderApply();
    renderResults();
    renderDownloads();
  });
})(jQuery);
