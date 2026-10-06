# Claude Code 向け手順書：作ったツールを URL にして公開する（GitHub Pages）

> この手順書は **Claude Code が読んで実行するためのもの** です。受講生と会話しながら、上から順に進めてください。
> RISE「AI自動化講座」20回目の配布物。受講生は「このURLを読んで、書いてある通りに進めてください」と送るだけ。
> この URL（https://ryoya9595.github.io/ai-jidoka-kouza/files/20-publish-url.md）を渡されたら、`curl -fsSL <URL>` で全文を取得して読む。**作業フォルダには保存しない**（画面に出して読むか、一時フォルダに置く）。
> 受講生が次のように送ってきたときも、この手順書の内容で進める（「診断ツール」は公開したいツールの名前に置き換わる）：
>
> --------------
> 診断ツールを、公開用の新しいリポジトリに入れて、GitHub Pagesで公開してください。作業フォルダのリポジトリは非公開のままにしてください。
> --------------
>
> 画面の名前が手順書と違うときは、GitHub 公式ドキュメント（https://docs.github.com/en/pages）を読み直して最新の名前で案内する。

---

## 0. ゴール

作業フォルダの `成果物/` に作ったツール（診断ツール・ホームページなど）を、**誰でもスマホから開ける URL** にする。

```
https://<GitHubユーザー名>.github.io/my-tools/<ツールのフォルダ>/
```

使うのは GitHub の **GitHub Pages**（GitHub に置いたファイルをそのまま Web サイトとして公開してくれる無料の機能。この講座の配布ページもこれ）。

**一番大事な考え方：**
GitHub の無料プランで GitHub Pages を使うには、リポジトリを **公開（public）** にする必要がある。公開にすると中身は誰でも見られる。だから **作業フォルダのリポジトリは公開にしない**（AI秘書の設定・日報・講座メモなど、自分だけの情報が入っている）。

- 作業フォルダ（例 `my-company`）→ **非公開のまま**（自分だけ）
- 公開用リポジトリ（例 `my-tools`）→ **公開したいツールのファイルだけ** を入れる

終わったときの形：

```
（作業フォルダの外）
~/my-tools/                      … 公開用リポジトリ（public）。Mac は ~/my-tools、Windows は C:\Users\<名前>\my-tools
├── index.html                   … 公開しているツールの一覧（目次）
├── .nojekyll                    … GitHub Pages にファイルをそのまま出してもらうための空ファイル
├── README.md
└── shindan/                     … ツール1つ＝フォルダ1つ
    └── index.html               … ツールの本体（ファイル名は必ず index.html）
```

---

## 1. 守ること（最優先）

- **受講生はパソコン初心者。** 専門用語を避け、短く・やさしい日本語で話す。**1〜3手順ずつ** 出して「できた」を待つ。
- **公開用リポジトリに入れるのは、公開していいツールのファイルだけ。** 作業フォルダを丸ごとコピーしない。`CLAUDE.md`・`私のプロフィール.md`・`daily/`・`講座メモ/`・`.claude/` は絶対に入れない。
- **公開する前に、秘密の情報が入っていないか必ず確認する**（フェーズ1）。LINE のトークン・パスワード・APIキー・メールアドレス・電話番号・お客さんの情報が1つでもあれば止まる。LINE の友だち追加 URL（`lin.ee/…`・`line.me/…`）のような「公開してよいリンク」は入っていてよい。
- **作業フォルダのリポジトリの公開設定（visibility）は触らない。** 最後に PRIVATE のままであることを確認する。
- **公開用リポジトリは作業フォルダの外に作る**（作業フォルダの中に入れると、非公開の作業フォルダに公開用の `.git` が混ざってしまう）。
- 受講生の代わりにアカウントを作らない・パスワードを入力しない。GitHub の画面操作が要るときは本人にブラウザでやってもらう。
- ファイルの作成・編集は Write / Edit ツールで行う（Windows の PowerShell のリダイレクトは文字化けするので使わない）。文字コードは UTF-8。

---

## フェーズ1：公開していいかの確認（読むだけ・何も変更しない）

Claude Code が自分で確認すること：

1. **公開するツールの場所**：受講生の言ったツールが `成果物/` のどこにあるか探す（例：`成果物/診断ツール/index.html`）。候補が複数なら一覧を見せて選んでもらう。HTML が1枚で完結しているか（画像や CSS・JS を別ファイルで読んでいれば、それも一緒に持っていく）
2. **秘密の情報チェック**：公開するファイルの中を、次の観点で読む（Claude Code 自身が中身を読んで判断する。grep の例：`grep -n -i -E 'token|secret|password|api[_-]?key|sk-|Bearer|@gmail|@yahoo|0[789]0-?[0-9]{4}-?[0-9]{4}' <ファイル>`）
   - LINE のチャネルアクセストークン・GAS や API のキー・パスワード
   - メールアドレス・電話番号・住所・本名（受講生が「出していい」と言った連絡先は OK）
   - お客さんの名前・やり取り
   - 作業フォルダの中の別ファイルを読む仕組み（公開先には無いので動かなくなる）
3. **gh のログイン状態**：`gh auth status` → ユーザー名を控える（`gh api user --jq .login`）
4. **すでに公開用リポジトリがあるか**：`gh repo view <ユーザー名>/my-tools --json name,visibility,url` → あればフェーズ2を飛ばしてフェーズ3へ（ローカルに無ければ `gh repo clone <ユーザー名>/my-tools ~/my-tools`）

受講生に聞くこと（1回のメッセージにまとめる）：

> ツールを URL にして公開する準備をします！3つ確認させてください。
> 1. 公開するのは **{ツールの場所}** でいいですか？
> 2. 公開すると **誰でも見られる** 状態になります（中身のファイルも見られます）。公開して大丈夫ですか？
> 3. 中身をチェックしました → {「秘密の情報は見つかりませんでした」／「○行目に △△ がありました。消すか、公開していいか教えてください」}

- 秘密の情報があった場合は、**消す（または公開しない）まで先に進まない**。消し方は作業フォルダ側のファイルを直す（公開用はそのコピー）
- 公開用リポジトリの名前は `my-tools` をおすすめする（受講生が変えたいなら英小文字とハイフンで）
- ツールのフォルダ名（URL の一部になる）は、英小文字で短く提案する（例：診断ツール → `shindan`、ホームページ → `home`）。日本語のフォルダ名は URL が長くなるので避ける

---

## フェーズ2：公開用リポジトリを作る（作業フォルダの外）

1. 受講生に一言：
   > 公開用の置き場 `my-tools` を、作業フォルダとは別に作ります（パソコンの中では {Mac：ホームフォルダの my-tools／Windows：ユーザーフォルダの my-tools} にできます）。
2. フォルダを作って git の準備（作業フォルダと同じく、本名・メールアドレスは使わない）：
   - Mac：`mkdir -p ~/my-tools`／Windows：`New-Item -ItemType Directory -Force "$HOME\my-tools"`
   - 以下は `~/my-tools` の中で実行する（`git -C ~/my-tools …` のように場所を指定する）
   - `git init -b main`
   - `git config pull.rebase false`
   - `git config user.name "<ユーザー名>"`
   - `git config user.email "<番号>+<ユーザー名>@users.noreply.github.com"`（番号は `gh api user --jq .id`）
3. 最初のファイルを作る（Write ツールで・UTF-8）：

`~/my-tools/README.md`
```markdown
# my-tools

{受講生の呼び名} さんが作ったツールの公開用リポジトリです（RISE AI自動化講座）。

- このリポジトリは **公開** です。パスワード・トークン・個人情報は入れません
- 各ツールはフォルダごとに `index.html` で置いています
- 公開 URL：https://{ユーザー名}.github.io/my-tools/
```

`~/my-tools/.nojekyll`（中身は空）

`~/my-tools/index.html`（ツールの目次。1つ目のツールを入れたあとに更新する。最低限の形）：
```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{受講生の呼び名}のツール一覧</title>
<style>
  body { font-family: sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; line-height: 1.8; }
  a { display: block; padding: 12px 16px; margin: 8px 0; border: 1px solid #ddd; border-radius: 8px; text-decoration: none; color: #222; }
</style>
</head>
<body>
<h1>ツール一覧</h1>
<!-- ツールを追加したら、ここに1行足す -->
<a href="./shindan/">{ツールの名前}</a>
</body>
</html>
```

4. **公開（public）で作って送る**：
   - `git add -A` → `git commit -m "公開用リポジトリを作成"`
   - `gh repo create my-tools --public --source . --remote origin --push`
   - 「すでに同じ名前がある」と出たら、受講生に別の名前を決めてもらう（以降の `my-tools` を読み替える）
5. `gh repo view --json name,visibility,url` で **visibility が PUBLIC** であること（公開用はこれが正しい）と URL を控える

---

## フェーズ3：ツールをコピーして入れる

1. 公開用の中にツールのフォルダを作る：`mkdir -p ~/my-tools/<フォルダ名>`（例：`shindan`）
2. 作業フォルダのツールを **コピー** する（移動しない。作業フォルダ側が「元」、公開用は「コピー」）：
   - 本体の HTML を `~/my-tools/<フォルダ名>/index.html` という名前で置く（元のファイル名が `診断ツール.html` などでも、公開先では **必ず `index.html`** にする。URL をフォルダまでで止められる）
   - 画像・CSS・JS を別ファイルで読んでいれば、同じ相対パスで一緒にコピーする。コピー後に `index.html` の中の読み込み先（`src=`／`href=`）が公開先でも合っているか確認する
   - 作業フォルダの他のファイルは入れない
3. `~/my-tools/index.html`（目次）に、このツールへのリンクを1行足す
4. `git -C ~/my-tools status --short` で **入れるファイルの一覧を受講生に見せる**（ここで最終確認。余計なファイルが無いか）
5. `git -C ~/my-tools add -A` → `git -C ~/my-tools commit -m "<ツール名>を追加"` → `git -C ~/my-tools push`

受講生に伝える：

> 公開用の置き場に **{ツール名}** を入れて GitHub に上げました。入れたのはこのファイルだけです：{一覧}
> 次に、URL で見られるようにする設定（GitHub Pages）をオンにします。

---

## フェーズ4：GitHub Pages をオンにする

**方法A：コマンドで（Claude Code がやる。まずこちらを試す）**

```
gh api -X POST repos/<ユーザー名>/my-tools/pages -f "source[branch]=main" -f "source[path]=/"
```

- 成功すると JSON が返り、`html_url` に `https://<ユーザー名>.github.io/my-tools/` が入っている
- 「409 Conflict」＝すでにオン（問題なし）。「404」や「403」＝権限不足か画面操作が必要 → 方法B へ
- 確認：`gh api repos/<ユーザー名>/my-tools/pages --jq '{status: .status, url: .html_url, branch: .source.branch}'`

**方法B：ブラウザで（受講生にやってもらう）**

> ブラウザで {リポジトリの URL}/settings/pages を開いてください。
> 1. 「**Build and deployment**」の「**Source**」が「**Deploy from a branch**」になっていることを確認
> 2. 「**Branch**」で「**None**」→「**main**」を選び、隣のフォルダは「**/ (root)**」のまま
> 3. 「**Save**」を押す
> 4. 上の方に「Your site is live at …」か、公開 URL が出たら「できた」と送ってください

（画面の名前が違うときは https://docs.github.com/en/pages を読み直す）

---

## フェーズ5：公開 URL を伝えて、動くのを確かめる

1. 公開 URL を組み立てる：`https://<ユーザー名>.github.io/my-tools/<フォルダ名>/`
2. 公開が終わったかを確かめる（数分かかる）：
   - `gh api repos/<ユーザー名>/my-tools/pages/builds/latest --jq .status` が `built` になるまで、30秒おきに数回見る（`queued`／`building` は待ち）
   - または `curl -s -o /dev/null -w "%{http_code}" <公開URL>` が `200` になるまで待つ（`404` は「まだ」）
3. 受講生に伝える：

> 公開できました！🎉
> **URL：{公開URL}**
> 反映に数分かかることがあります。404 と出たら少し待ってから開き直してください。
> スマホでも開いて、ツールが動くか確かめてみてください。
> このリポジトリ全体の入り口は {https://<ユーザー名>.github.io/my-tools/}（ツール一覧）です。

4. 受講生がスマホで動くのを確認したら、次へ

---

## フェーズ6：作業フォルダが非公開のままか確認する

1. 作業フォルダに戻って `gh repo view --json nameWithOwner,visibility`（作業フォルダの中で実行）→ **visibility が PRIVATE** であることを確認
2. 公開用も確認：`gh repo view <ユーザー名>/my-tools --json nameWithOwner,visibility` → PUBLIC
3. 受講生に伝える：

> 確認しました。
> ・作業フォルダ `{作業フォルダのリポジトリ名}` → **非公開（Private）のまま** ✅
> ・公開用 `my-tools` → 公開（Public）。入っているのは {ツール名} だけ ✅
> ブラウザでも https://github.com/{ユーザー名}?tab=repositories を開くと、作業フォルダの横に「Private」と付いているのが見られます。

---

## フェーズ7：更新のしかたを覚える（CLAUDE.md にルールを足す）

作業フォルダの `CLAUDE.md` の末尾に、下のルールを追記する（既存の内容は消さない。```markdown の囲みの「中身だけ」）。`{…}` は実際の値にする。

```markdown
## 公開しているツール（GitHub Pages）
- 公開用リポジトリ：{ユーザー名}/my-tools（公開・public）。パソコンの中の場所：{~/my-tools の実際のパス}
- 公開 URL：https://{ユーザー名}.github.io/my-tools/
- 公開中のツール（作業フォルダ側が「元」、公開用は「コピー」）：
  - {ツール名}：`成果物/{元のパス}` → `my-tools/{フォルダ名}/index.html` → https://{ユーザー名}.github.io/my-tools/{フォルダ名}/
- 「**公開しているツールも更新して**」と言われたら：
  1. 上の表の「元」のファイルを、公開用の同じ場所にコピーする（名前は index.html のまま）
  2. 公開用に入れる前に、秘密の情報（トークン・パスワード・個人情報）が混ざっていないか確認する
  3. `git -C {my-toolsのパス} add -A` → 日本語のメッセージでコミット → `git -C {my-toolsのパス} push`
  4. URL はそのまま。反映に数分かかると伝える
- 新しいツールを公開するときは、新しいフォルダを足して、`my-tools/index.html`（目次）にもリンクを1行足し、この表にも1行足す
- 作業フォルダ（このリポジトリ）の公開設定は変えない。公開用に `CLAUDE.md`・`私のプロフィール.md`・`daily/`・`講座メモ/`・`.claude/` を入れない
```

受講生に伝える：

> ツールを直したあとは、「**公開しているツールも更新して**」と言ってください。URL はそのままで、中身が新しくなります（反映まで数分）。
> 新しいツールを公開したいときは「○○も公開して」で、同じ置き場に追加できます。

最後に「GitHubに上げて」で、作業フォルダ側（CLAUDE.md の変更）も上げる。

---

## フェーズ8：完了報告

> 作ったツールが、誰でも使える URL になりました！🎉
> **{公開URL}**
> ・公式 LINE のメッセージや SNS のプロフィールに貼れば、特典として配れます
> ・直したら「公開しているツールも更新して」
> ・アウトプット部屋に URL を投稿して、他の人のツールも触ってみてください
>
> ⚠️ 公開用の置き場には、秘密の情報を絶対に入れないでください。心配なときは「公開する前に、秘密の情報が入っていないかチェックして」と言ってもらえれば確認します。

---

## 付録：うまくいかないとき

| 症状 | 原因 | 対処 |
|---|---|---|
| URL を開くと 404 | 公開の反映待ち（数分） | `gh api repos/<ユーザー名>/my-tools/pages/builds/latest --jq .status` が `built` になるまで待って開き直す |
| 待っても 404 | GitHub Pages がオンになっていない | `gh api repos/<ユーザー名>/my-tools/pages` が 404 ならフェーズ4（方法B）で Settings → Pages → Branch main → Save |
| フォルダの URL で 404、ファイル名まで書くと開く | ファイル名が `index.html` でない | `index.html` に名前を変えて push |
| `_` で始まるフォルダ・ファイルが出ない | Jekyll の処理で隠される | ルートに空の `.nojekyll` を置く |
| 画像や CSS が出ない | 読み込み先のパスが作業フォルダ基準のまま | 同じフォルダに一緒にコピーして、`src=`／`href=` を `./` からの相対パスに直す |
| `gh api … pages` が 403 | gh のログインに権限が足りない | 方法B（ブラウザ）でオンにする。または `gh auth refresh -h github.com -s repo` を受講生に聞いてから |
| 「Upgrade to GitHub Pro」と出る | 非公開リポジトリで Pages を使おうとした | 公開用リポジトリ（public）側でやっているか確認。作業フォルダは公開にしない |
| 直したのに中身が古い | ブラウザのキャッシュ／push 忘れ | スマホで開き直す（再読み込み）。`git -C ~/my-tools status`・`git log origin/main..main` で push 済みか確認 |
| 作業フォルダが PUBLIC になっている | 誤操作 | 作業フォルダの中で `gh repo edit --visibility private --accept-visibility-change-consequences` → 受講生に報告 |
