// ===== 貼り付け用メッセージを回ごとに生成 =====
const BASE = "https://ryoya9595.github.io/ai-jidoka-kouza/";

const COMMON = `
【進め方】
1. 手順書を curl（Windows は curl.exe）で取得して、全文を読んでください。
   ※ 要約して読むツールではなく、原文をそのまま読んでください。
   ※ 手順書のファイルは、このフォルダには保存しないでください（画面に出すか、一時フォルダへ）。
2. 手順書に書いてある順番で、1〜3手順ずつ、私に確認しながら進めてください。
3. 私はパソコンに詳しくないので、やさしい言葉で、短く説明してください。`;

function runPrompt(url, what) {
  return `${what}

【手順書】
${url}
${COMMON}`;
}

function helpPrompt(url, what) {
  return `${what}でつまずいています。

【手順書】
${url}

手順書を curl（Windows は curl.exe）で取得して全文を読んでから、私が今どこで困っているかを1問ずつ聞いて、その場所に合わせて案内してください。
パスワードの入力やアカウント作成は私が自分でやるので、やり方だけ教えてください。
私はパソコンに詳しくないので、やさしい言葉で、短く説明してください。`;
}

const TEXTS = {
  p02: helpPrompt(BASE + "files/02-first-setup.md", "Claude Code の初期設定（AI自動化講座 第2回）"),
  p03: runPrompt(BASE + "files/03-workspace-setup.md", "このフォルダを、AI自動化講座の「作業フォルダ」にして、GitHub（非公開）につないでください。"),
  p04: runPrompt(BASE + "files/04-ai-secretary.md", "この作業フォルダに、私専用のAI秘書を作ってください。"),
  p07: runPrompt(BASE + "files/07-line-tokuten.md", "公式LINEの登録特典を1つ作りたいです。手順書どおりに進めてください。"),
  p08: runPrompt(BASE + "files/08-skill-create.md", "「スキル作成スキル」を、この作業フォルダにスキルとして入れてください。"),
  p10: runPrompt(BASE + "files/10-nippo-skill.md", "「日報スキル」を、この作業フォルダにスキルとして入れてください。"),
  p11: runPrompt(BASE + "files/11-kouza-kaisetsu.md", "自分用の「講座解説スキル」を作りたいです。手順書どおりに進めてください。"),
  p12: runPrompt(BASE + "files/12-nippo-routine.md", "日報を、毎日決まった時間に自動で作られるようにしたいです。手順書どおりに進めてください。"),
  p13: `スマホから Claude Code を使えるようにしたいです。

【手順書（専用ページ）】
https://ryoya9595.github.io/claude-code-mobile/
${COMMON}`,
  p15: helpPrompt(BASE + "files/15-mcp-connect.md", "コネクタ（MCP）の接続（AI自動化講座 第15回）"),
  p17: runPrompt(BASE + "files/17-shindan-tool.md", "公式LINEの特典になる「診断ツール」を作りたいです。手順書どおりに進めてください。"),
  p18: runPrompt(BASE + "files/18-short-maker-setup.md", "AI動画生成システム（my-short-maker）をこの作業フォルダに入れて、サンプルで1本作ってください。"),
  p19: `LINE通知の仕組みを作りたいです。

【手順書（専用ページ）】
https://ryoya9595.github.io/line-notify-kit/

ページを curl（Windows は curl.exe）で取得して読み、ページに書いてある「AIに読ませる導入手順」に従って、1〜3手順ずつ、私に確認しながら進めてください。
トークンは画面に出さない・ファイルに書かない・GitHubに上げないでください。
私はパソコンに詳しくないので、やさしい言葉で、短く説明してください。`,
  p20: runPrompt(BASE + "files/20-publish-url.md", "作ったツールをURLにして公開したいです。手順書どおりに進めてください。"),
};

Object.entries(TEXTS).forEach(([id, text]) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
});

// ===== コピー処理 =====
async function copyText(text, target) {
  let ok = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch { ok = false; }
  if (!ok && target) {
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    sel.removeAllRanges();
  }
  return ok;
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    const text = TEXTS[targetId] || (target ? target.textContent : "");
    const ok = await copyText(text, target);
    const original = button.textContent;
    button.textContent = ok ? "コピーしました" : "手動でコピー";
    button.classList.toggle("done", ok);
    showToast(ok ? "📋 コピーしました" : "コピーできませんでした");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("done");
    }, 2000);
  });
});

// ===== ナビ現在地ハイライト =====
const navLinks = [...document.querySelectorAll(".topnav a")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = "#" + e.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => io.observe(s));
}
