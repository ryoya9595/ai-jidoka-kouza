# Claude Code 向け手順書：作業フォルダを作って GitHub（非公開）につなぐ

> 🤖 **Claude Code へ**：受講生がこのURLだけを貼って送ってきたら、これが今回の手順書です。curl（Windows は curl.exe）で全文を取得して、要約せず原文のまま読み、上から順に、1〜3手順ずつ受講生に確認しながら進めてください。受講生はパソコン初心者なので、やさしい言葉で短く話してください。手順書そのものは作業フォルダに保存しないでください。

> この手順書は **Claude Code が読んで実行するためのもの** です。受講生と会話しながら、上から順に進めてください。
> RISE「AI自動化講座」03回目の配布物。受講生はこのURLを Claude Code に貼って送るだけ。
> 画面の名前が手順書と違うときは、公式ドキュメント（https://code.claude.com/docs/en/claude-code-on-the-web）を読み直して最新の名前で案内する。
> 配布URL：https://ryoya9595.github.io/ai-jidoka-kouza/files/03-workspace-setup.md

---

## 0. ゴール

今 Claude Code で開いているフォルダを、受講生の **作業フォルダ** にする。

- AI秘書の記憶・スキル・作ったものを、全部このフォルダ1つにまとめる
- このフォルダを GitHub の **非公開（private）リポジトリ** に保管する
- スマホ（Claude アプリの Code）や、クラウドの自動実行（ルーティン）からも、このフォルダが使えるようにする（Claude GitHub App の許可）

終わったときの形：

```
作業フォルダ/
├── CLAUDE.md          … AIへのルール（毎回読まれる）
├── README.md          … このフォルダの説明
├── .gitignore         … GitHubに上げないものの一覧（秘密の情報など）
├── .claude/skills/    … スキルの置き場
├── daily/             … 日報・メモの置き場
└── 成果物/            … 作ったもの（ページ・ツール・特典など）の置き場
```

---

## 1. 守ること（最優先）

- **受講生はパソコン初心者。** 専門用語を避け、短く・やさしい日本語で話す。**1〜3手順ずつ** 出して「できた」を待つ。
- **受講生の代わりにアカウントを作らない・パスワードを入力しない。** GitHub の登録・ログイン・承認ボタンは本人にブラウザでやってもらう。
- **パスワード・トークン・APIキーの中身を画面に表示しない。** `.env` などの認証情報ファイルは読まない。
- **インストールする前に必ず聞く**（何を・なぜ入れるかを1行で伝えてOKをもらう）。
- **リポジトリは必ず非公開（private）で作る。** 作成後に必ず確認する。
- **今のフォルダに、すでに大事なファイルがたくさん入っている場合は止まる。** 「新しい空のフォルダで始めた方が安全です」と伝えて、新しいフォルダを作って開き直してもらう（この講座は新しいフォルダから始める前提）。
- ファイルの作成・編集は Write / Edit ツールで行う（Windows の PowerShell のリダイレクトは文字化けするので使わない）。文字コードは UTF-8。

---

## フェーズ1：確認（読むだけ・何も変更しない）

Claude Code が自分で確認すること：

1. **OS**（Mac / Windows）
2. **今のフォルダの場所と中身**：`ls -la`（Windows は `Get-ChildItem -Force`）
   - ホームフォルダそのもの（`~`／`C:\Users\<名前>`）やデスクトップ全体を開いていたら止まる → 「新しいフォルダを1つ作って、そのフォルダを開き直してください」と案内
   - **iCloud で同期している「デスクトップ」「書類」や、OneDrive の中のフォルダだった場合も止まる**（同期で `.git` が壊れる事故が起きるため）→ 「ホームフォルダ（自分の名前のフォルダ）の直下に `my-company` のような新しいフォルダを作って、開き直してください」と案内。Mac でフォルダへのアクセス許可を求められたら「許可」を押してもらう
   - この手順書（作業フォルダセットアップ.md）以外に、ファイルが10個以上ある → 上の「守ること」どおり止まって確認
   - すでに `.git` がある → 「このフォルダは前にGitHubとつないだことがあるようです」と伝え、`git remote -v` の結果を見せて、続けるか聞く。続ける場合は、フェーズ5の `git init` と `gh repo create` を飛ばし、既存の origin に `git push -u origin main` する（origin が無ければ `gh repo create {リポジトリ名} --private --source . --remote origin --push`）
3. **git と gh が入っているか**：`git --version`、`gh --version`

受講生に聞くこと（1回のメッセージにまとめる）：

> 作業フォルダの準備を始めます！2つだけ教えてください。
> 1. GitHub のアカウントはもう作りましたか？（まだなら一緒に作ります）
> 2. リポジトリ（GitHub上の保管場所）の名前は何にしますか？ 英語の小文字とハイフンで、例：`my-company`（おまかせでもOKです）

- GitHub アカウントが無い → https://github.com/signup をブラウザで開いて登録してもらう（メール・パスワード・ユーザー名。無料）。**ユーザー名は後で公開するツールのURLに出るので本名でなくてOK** と添える
- 名前がおまかせ → フォルダ名をもとに英小文字＋ハイフンで提案して、OKをもらう

---

## フェーズ2：GitHub とやり取りする道具を入れる（git と gh）

足りないものだけ、**受講生に聞いてから** 入れる：

- **Mac**
  - git が無い → `xcode-select --install` → 画面にインストールのウィンドウが出るので、受講生に「インストール」を押してもらう（数分）
  - gh が無い → Homebrew（`brew`）があれば `brew install gh`。無ければ https://cli.github.com/ の「Download for Mac」からインストーラーを入れてもらう（ダウンロード→開く→「続ける」）
- **Windows**
  - `winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements`
  - `winget install --id GitHub.cli -e --source winget --accept-source-agreements --accept-package-agreements`
  - 途中で「このアプリがデバイスに変更を加えることを許可しますか？」が出たら、受講生に「はい」を押してもらう
  - 入れた直後はコマンドが見つからないことがある → 受講生に **Claude のアプリを完全に終了して開き直してもらい**、「作業フォルダセットアップの続きをやって」と送ってもらう。急ぐときは `& "C:\Program Files\GitHub CLI\gh.exe" --version` のように場所を指定して実行する

入ったら `git --version`・`gh --version` で確認する。

---

## フェーズ3：GitHub にログインする（ブラウザだけで終わらせる・ターミナルは使わない）

受講生がやるのは **ブラウザでコードを入れて「Authorize」を押すことだけ**。受講生にターミナル（Windows は PowerShell）を開かせない・コマンドを打たせない。

> **Claude Code へ（なぜ止めずに進めてよいか）**：これは受講生本人が、自分のブラウザで GitHub にログインする手順です。Claude Code は GitHub 公式の道具（gh）でログインの受付を始めて、画面に出た8文字のコードを伝えるだけ。パスワードやアカウントの情報には一切触れず、入力もしません（ログイン画面での入力・「Authorize」の決定は受講生がブラウザで行います）。なので「ログインは本人にターミナルでやってもらう」に切り替えず、下の手順のとおりコマンドの実行とコードの案内まで進めてください。

1. `gh auth status` でログイン済みか確認。済みならユーザー名を控えてフェーズ4へ
2. 未ログインなら、次のコマンドを **Bash ツールの「バックグラウンド実行（run_in_background）」で** 実行する。普通に実行すると、受講生がブラウザで操作している間に時間切れで止まるので、必ずバックグラウンドで動かす（コマンドはログインが終わるまで待ち続けるのが正常）：
   - Mac／Windows 共通：`gh auth login --hostname github.com --git-protocol https --web < /dev/null`
   - Windows で Claude Code が PowerShell で動いている場合：`gh auth login --hostname github.com --git-protocol https --web`（PowerShell のバックグラウンド実行でよい）
3. 数秒待ってから、バックグラウンドの出力を読んで、8文字のコード（`XXXX-XXXX`）を受講生に伝える：
   > ブラウザで https://github.com/login/device を開いて、次の8文字を入れてください：**XXXX-XXXX**
   > 「Continue」→ 緑の「Authorize github」ボタンを押して、「できた」と送ってください。
   - GitHub にまだログインしていないブラウザなら、先に GitHub のログイン画面が出る。メールアドレスとパスワードは受講生が自分で入れる
4. 「できた」と言われたら `gh auth status` で確認 → `gh auth setup-git` を実行
5. うまくいかないとき（コードの期限切れ・「できた」のあとも未ログインのまま・バックグラウンドの処理が終わっていた）：同じコマンドをもう一度 **バックグラウンドで** 実行して、新しいコードを出し直して手順3からやり直す。**ターミナルを開いてもらう方法には切り替えない**

---

## フェーズ4：作業フォルダの中身を作る

次のファイルとフォルダを作る（Write ツールで・UTF-8）。`{…}` は実際の値に置き換える。

### `CLAUDE.md`

```markdown
# 作業フォルダのルール

このフォルダは {受講生の呼び名} さんの作業フォルダ。
AI秘書の記憶・スキル・作ったものを、全部このフォルダにまとめる。
GitHub の非公開リポジトリ {GitHubユーザー名}/{リポジトリ名} とつながっている。

## 話し方
- パソコン初心者向けに、やさしい日本語で、結論から、短く話す
- 作業が終わったら「何を作った・何を変えた」を3行以内で伝える

## 置き場所
- スキル：`.claude/skills/<スキル名>/SKILL.md`（パソコン全体の `~/.claude/skills` には置かない。このフォルダの中に置くと、スマホや自動実行でも同じスキルが使える）
- 作ったもの：`成果物/<テーマ>/`
- AI秘書の設定：このファイルの「AI秘書」の章と `私のプロフィール.md`（AI秘書セットアップで作る）

## 記録の部屋割り（Obsidian の保管庫。AI秘書の記憶）
このフォルダは Obsidian の保管庫にもなっている。記録は **許可を取らずに、その場ですぐ書く**。書いたら返事の最後に「（📝 記録しました）」と小さく添える。受講生に手で書かせない。
| 部屋 | 何を書くか | 書くタイミング |
|---|---|---|
| `daily/YYYY-MM-DD.md` | その日にやったこと・決めたこと・分かったこと（今日の日付・日本時間） | 作業が一区切りしたとき・話題が変わるとき。**追記**（上書きしない） |
| `todos/YYYY-MM-DD.md`／`todos/backlog.md` | やること。今日やる分は日付のファイル、いつかやる・保留は backlog | 「あとでやる」「やらなきゃ」が出たとき。終わったら `- [x]` にする |
| `projects/_INDEX.md` | 進めていること一覧と、それぞれの「今どこ・次なに」を1〜2行 | 進み具合が変わったとき（新しく始めた・止まった・終わった） |
| `decisions/YYYY-MM-DD-<内容>.md` | 大事な判断と、その理由 | 方針や大事なことを決めたとき |
| `mistakes/YYYY-MM-DD-<内容>.md` | 失敗・指摘されたこと、原因、次からどうするか | 間違いを指摘されたとき・うまくいかなかったとき |
| `ideas/<テーマ>.md` | 思いつき・やってみたいこと | アイデアを話されたとき |
- 作業フォルダを開いて **最初のメッセージに答えるとき** は、`projects/_INDEX.md`・`todos/` の今日の分と `backlog.md`・`daily/` の直近3日分を読んでから答える（前回の続きが分かった状態で話す）
- 「Obsidian連携はできていますか？」と聞かれたら、次を確認して、できている／できていないを短く答える：①Obsidian が入っているか（Mac：`/Applications/Obsidian.app`／Windows：`winget list --id Obsidian.Obsidian`）②Obsidian の設定ファイル（Mac `~/Library/Application Support/obsidian/obsidian.json`／Windows `%APPDATA%\obsidian\obsidian.json`）の保管庫一覧にこのフォルダが入っているか ③このフォルダに `.obsidian/` と上の部屋（daily・todos・projects・decisions・mistakes・ideas）があるか。足りなければその場で直してよいか聞く
- 秘密の情報・個人情報は記録に書かない

## GitHub との同期（自動でやる）
- **作業フォルダを開いて最初の作業をする前に**、聞かずに「GitHubの最新を取り込んで」の手順（下）をやる。取り込むものが無ければ何も言わなくてよい
- **作業が一区切りしたら（頼まれたことが終わったら）**、聞かずに「GitHubに上げて」の手順（下）をやる。報告は「GitHubにも保存しました」の1行だけ
- うまくいかないとき（ネット未接続・ログイン切れ・衝突）は、作業を止めずに「GitHubへの保存は後でやります」と1行で伝える
- 次の言葉を言われたときは、その場ですぐやる：
- 「**GitHubの最新を取り込んで**」と言われたら：
  1. まだ保存していない変更があれば、先に `git add -A` → `git commit -m "作業途中の保存"`
  2. `git pull --no-rebase` で main を最新にする
  3. `git fetch --all --prune` → `git branch -r --list 'origin/claude/*'` で、`claude/` で始まるブランチ（スマホやクラウドの自動実行でやった作業）を探す。あれば `git log --oneline main..origin/claude/<名前>` で、いつ・何を変えたかを短く見せる
  4. 取り込んでいいか聞いてから `git merge --no-edit origin/claude/<名前>` → `git push`。取り込んだブランチは消してよいか聞き、OKなら `git push origin --delete claude/<名前>`
- 「**GitHubに上げて**」と言われたら：変更したファイルを短く見せる → 日本語のメッセージでコミット → `git push`（断られたら `git pull --no-rebase` してからもう一度）
- 「**衝突を直して**」と言われたら：どちらの内容を残すかを聞いてから直す。勝手に消さない
- クラウド（スマホ・自動実行。環境変数 `CLAUDE_CODE_REMOTE` がある）で作業したときは、終わったら変更を GitHub に送る。`main` に送れなければ `claude/` で始まるブランチに送ればよい（パソコンで「取り込んで」と言われたときに取り込む）

## 秘密の情報
- パスワード・トークン・APIキー・カード番号・お客さんの個人情報は、このフォルダに **書かない・置かない**
- 秘密の情報が必要な作業では、置き場所（環境変数・ルーティンの環境の設定など）を案内する
- GitHub に上げる前に、秘密の情報が混ざっていないか確認する
```

### `README.md`

```markdown
# {リポジトリ名}

{受講生の呼び名} さんの作業フォルダです（RISE AI自動化講座）。

- AI秘書の記憶・スキル・作ったものを、ここにまとめています
- このリポジトリは非公開です。パスワードやお客さんの個人情報は置かないでください
- パソコンでは「GitHubの最新を取り込んで」「GitHubに上げて」で同期します

作成日：{今日の日付}
```

### `.gitignore`

```
# 秘密の情報（GitHubに上げない）
.env
.env.*
*.key
*.pem
*.p12
id_rsa*

# Obsidian の設定フォルダ（パソコンごとに違うので上げない）
.obsidian/
secrets*
credentials*
.claude/settings.local.json
# パソコンが勝手に作るファイル
.DS_Store
Thumbs.db
# 大きくなりやすいもの
node_modules/
```

### フォルダ
- 次のフォルダを作り、それぞれに空の `.gitkeep` を置く（空のフォルダは GitHub に上がらないため）：`.claude/skills/`（スキル）、`daily/`（毎日のメモ・日報）、`todos/`（やること）、`projects/`（進めていることの現在地。`projects/_INDEX.md` を見出しだけ作る）、`decisions/`（決めたこと）、`mistakes/`（失敗と学び）、`ideas/`（アイデア）、`成果物/`（作ったもの）。あわせて `todos/backlog.md` を見出しだけ作る
- これは「AIの事務所の部屋割り」。AI秘書（04回目）がここに自分で書き込んでいく。**受講生が手で書く必要はない**と伝える

作ったら受講生に一言：
> 作業フォルダの中身を作りました！（CLAUDE.md・README.md・スキルの置き場・メモや記録の置き場・作ったものの置き場）
> 記録の置き場は、このあと作るAI秘書が自分で埋めていくので、皆さんが手で書く必要はありません。

---

## フェーズ5：GitHub に非公開で保管する

1. git の準備（このフォルダの中だけに設定する。受講生の本名やメールアドレスは使わない）：
   - `gh api user --jq .login` でユーザー名、`gh api user --jq .id` で番号を取る
   - `git init -b main`
   - `git config pull.rebase false`（あとで「取り込んで」のときに止まらないように）
   - `git config user.name "<ユーザー名>"`
   - `git config user.email "<番号>+<ユーザー名>@users.noreply.github.com"`（GitHub が用意している、公開されない専用アドレス）
2. **この手順書（作業フォルダセットアップ.md）は GitHub に上げない。** 受講生に「この手順書は使い終わったら消して大丈夫です。今消していいですか？」と聞き、OKなら削除する（NGなら `.gitignore` に追加する）
3. `git add -A` → `git status --short` で上げるファイルの一覧を受講生に見せる（秘密の情報が混ざっていないか確認）→ `git commit -m "作業フォルダを作成"`
4. `gh repo create {リポジトリ名} --private --source . --remote origin --push`
   - 「すでに同じ名前がある」と出たら、受講生に別の名前を決めてもらう
5. `gh repo view --json name,visibility,url` で **visibility が PRIVATE** であることを必ず確認する（PUBLIC なら `gh repo edit --visibility private --accept-visibility-change-consequences` で非公開に直す）

受講生に伝える：
> GitHub に保管できました！（あなた以外は見られない **非公開** です）
> GitHub の画面：{url}

---

## フェーズ6：スマホ・自動実行から使えるようにする（Claude GitHub App）

スマホの Claude アプリ（Code）やクラウドの自動実行（ルーティン）からこのフォルダを使うには、Claude にこのリポジトリを見る許可を出す必要がある。**この1手順を忘れると、あとでスマホからフォルダが選べない。**

1. 受講生に聞いてから、ブラウザで https://claude.ai/code を開く（Mac：`open https://claude.ai/code`／Windows：`start https://claude.ai/code`）
2. 受講生に案内する：
   1. Claude のアカウントでログインしていなければログイン（パソコン・スマホと **同じアカウント**）
   2. 「GitHub と接続」（英語なら **Connect GitHub**）が出たら押す → GitHub の画面で緑の「Authorize」を押す
   3. 「Claude GitHub App をインストール」の案内が出たら進む（出なければ https://github.com/apps/claude/installations/new を開いてもらう）
   4. **「Only select repositories」（選んだリポジトリだけ）** を選び、`{リポジトリ名}` を選んで「Install」（すでにインストール済みで「Configure」になっている場合は、そこから `{リポジトリ名}` を追加して「Save」）
      - 「All repositories」（全部）は選ばない
   5. 「環境（environment）」を作る画面が出たら、何も変えずに進める
3. 「できた」を待つ

---

## フェーズ6.5：Obsidian を連携する（インストールから保管庫の登録まで自動）

Obsidian は、フォルダの中のメモを見るための無料アプリ。**入れておくと、AI秘書が書いた記録をいつでも見られる**。見なくても記録は勝手に溜まるので、「導入したら、普段は開かなくてよい」と伝える。受講生にやってもらうのは「許可」を押すことだけ。

1. **入れていいか聞く**：「記録を見るためのアプリ（Obsidian・無料）を入れます。いいですか？」
2. **インストール**（すでに入っていれば飛ばす。Mac：`/Applications/Obsidian.app` があるか／Windows：`winget list --id Obsidian.Obsidian`）
   - Mac：`brew -v` が通れば `brew install --cask obsidian`。Homebrew が無ければ `open https://obsidian.md/download` で開いて、受講生にダウンロード→アプリケーションフォルダへ入れてもらう
   - Windows：`winget install --id Obsidian.Obsidian -e --accept-source-agreements --accept-package-agreements`（「許可しますか？」が出たら「はい」を押してもらう）
3. **作業フォルダを保管庫として登録する**（受講生に「保管庫としてフォルダを開く」を押させない）
   1. Obsidian が起動していれば閉じる（Mac：`osascript -e 'quit app "Obsidian"'`／Windows：`Stop-Process -Name Obsidian -ErrorAction SilentlyContinue`）
   2. 設定ファイルを開く：Mac `~/Library/Application Support/obsidian/obsidian.json`／Windows `%APPDATA%\obsidian\obsidian.json`。無ければフォルダごと作って `{"vaults":{}}` で始める
   3. `vaults` に1件足す（Read / Write ツールで JSON を書き換える）。キーは16桁の英小文字＋数字のランダムな文字列、値は `{"path": "<作業フォルダの絶対パス>", "ts": <今のミリ秒>, "open": true}`。ほかの保管庫の `open` は `false` にする。すでに同じ `path` があれば `open: true` にするだけ
   4. 作業フォルダの直下に `.obsidian/` フォルダを作る（中身は空でよい。`.gitignore` で除外済み）
4. **開く**：Mac `open -a Obsidian`／Windows `start "" "obsidian://open?path=<作業フォルダの絶対パスをURLエンコード>"`。作業フォルダが開いた状態で立ち上がれば完了。「信頼する」などの確認が出たら押してもらう
5. 受講生に伝える：
   > Obsidian を連携しました。AI秘書の記録（daily・todos・projects…）は、見たくなったらここで見られます。見なくても記録は勝手に溜まっていくので、普段は開かなくて大丈夫です。

受講生が「Obsidian は要らない」と言ったら飛ばしてよい（記録の仕組み自体は変わらない）。

---

## フェーズ7：完了報告

最後に短く伝える：

> 作業フォルダの準備が完了しました！🎉
> これから AI秘書・スキル・作ったものは、全部このフォルダに入れていきます。
>
> **GitHubとの同期は、私が自動でやります**（作業を始めるときに最新を取り込み、一区切りしたら上げます）。何も言わなくて大丈夫です。
>
> 次は、この作業フォルダの中に **AI秘書** を作ります。

---

## 付録：うまくいかないとき

| 症状 | 原因 | 対処 |
|---|---|---|
| `gh: command not found`（Windows） | 入れた直後でコマンドが見つからない | `C:\Program Files\GitHub CLI\gh.exe` を直接使う／新しいセッションで続き |
| `xcode-select` のウィンドウが出ない | すでに入っている／画面の裏に隠れている | `git --version` で確認。隠れていたら Dock から探してもらう |
| `gh repo create` で権限エラー | ログインが途中で止まった | `gh auth status` → だめなら フェーズ3 をやり直す |
| push で `Authentication failed` | git が gh のログインを使えていない | `gh auth setup-git` をもう一度 |
| スマホ・ルーティンでリポジトリが選べない | Claude GitHub App に許可していない | フェーズ6 をやり直して、`{リポジトリ名}` を追加 |
| 「GitHub access is required」 | 会社（Team／Enterprise）のアカウントで GitHub 連携が無効 | 管理者に相談してもらう |
