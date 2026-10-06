# Claude Code 向け手順書：AI動画生成システム（my-short-maker）を入れて、1本作る

> この手順書は **Claude Code が読んで実行するためのもの** です。受講生と会話しながら、上から順に進めてください。
> RISE「AI自動化講座」18回目の配布物。受講生は、このURL（https://ryoya9595.github.io/ai-jidoka-kouza/files/18-short-maker-setup.md ）を貼って「読んで進めて」と送るだけ。
> このURLを渡されたら、curl（Windows は curl.exe）で全文を取得して読む。手順書そのものは作業フォルダに保存しない。
> キット本体（解説ページ）：https://ryoya9595.github.io/my-short-maker/

---

## 0. ゴール

台本（テーマだけでもOK）を渡すと、**顔出しなしの縦型ショート動画（MP4）** が自動でできあがる仕組みを、受講生の作業フォルダに入れる。

- Claude Code は絵も声も作らない。**台本を書いて、無料の外部サービス（AI音声＝gTTS／AI画像＝Pollinations）とパソコンの中の道具（FFmpeg／Remotion）に発注するだけ**
- 追加課金ゼロ・APIキー不要。インターネット接続は必要
- 入れる場所：`作業フォルダ/.claude/skills/my-short-maker/`（スキルとして `/my-short-maker` で呼び出せるようにする）

終わったときの形：

```
作業フォルダ/
└── .claude/skills/my-short-maker/
    ├── SKILL.md         … スキル本体（Claude Code が読む）
    ├── script.json      … 台本（1本ごとに書き換える）
    ├── settings.json    … 声・色・フォントなどの好み（育てる）
    ├── scripts/generate.py … 音声と背景画像の発注
    ├── app/             … 動画の組み立て（Remotion）
    └── output/          … 完成した動画（GitHubには上げない）
```

---

## 1. 守ること（最優先）

- **受講生はパソコン初心者。** 専門用語を避け、短く。**1〜3手順ずつ** 出して「できた」を待つ
- **インストールする前に必ず聞く**（何を・なぜ入れるかを1行で伝えてOKをもらう）
- パスワードの入力や、管理者の許可（「許可しますか？」の画面）は受講生本人に押してもらう
- `curl | sh` のような「ダウンロードしてそのまま実行」はしない。インストーラーは受講生がブラウザからダウンロードして開く
- 動画ファイル（mp4）は大きいので GitHub に上げない（`.gitignore` に追加する）
- 外部サービス（gTTS・Pollinations）は無料の公共サービス。混んでいて遅い・たまに失敗することがある、と最初に伝えておく
- 背景画像（Pollinations）の無料枠は **15秒に1回** なので、キットは1枚ずつ間隔を空けて取りに行く。背景7枚で2〜3分待つのが正常。「402」が出ても自動で待って取り直す。それでも作れなかったときは背景なし（色のグラデーション）で動画は完成する

---

## フェーズ1：道具がそろっているか確認する（読むだけ）

次を順に実行して、**入っている／入っていない** を表にして受講生に見せる。

| 道具 | 用途 | 確認コマンド |
|---|---|---|
| Node.js と npm | 動画の組み立て（Remotion） | `node -v` と `npm -v` |
| Python 3 | 発注スクリプト | `python3 --version`（Windows は `python --version`） |
| FFmpeg | 音声の長さを測る・動画をつなぐ | `ffmpeg -version` と `ffprobe -version` |
| gTTS | AI音声 | `python3 -c "import gtts; print('ok')"` |
| インターネット | 音声・画像の発注 | `curl -sI https://translate.google.com | head -1` |

受講生に伝える例：

> 動画づくりに必要な道具を確認しました。
> ・Node.js：入っています
> ・Python：入っています
> ・FFmpeg：**入っていません** → これから入れます（動画をつなぐ道具です）
> ・gTTS：**入っていません** → これから入れます（AI音声の道具です）

全部そろっていればフェーズ3へ。

---

## フェーズ2：足りない道具を入れる（受講生に聞いてから）

足りないものだけ、**1つずつ** 入れる。

### Mac

- **Homebrew があるか**：`brew -v`
  - 無ければ、受講生に https://brew.sh/ja/ を開いてもらい、ページに書かれたコマンドを **本人が「ターミナル」に貼って実行** してもらう（パスワードを聞かれる。Claude Code は代わりにやらない）。終わったら「できた」と送ってもらう
- **Node.js**：`brew install node`（Homebrew が無い場合は https://nodejs.org/ の「LTS」をダウンロードして本人がインストール）
- **FFmpeg**：`brew install ffmpeg`（数分かかる）
- **Python 3**：Mac には最初から入っていることが多い。無ければ `brew install python`

### Windows

- `winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements`
- `winget install --id Python.Python.3.12 -e --accept-source-agreements --accept-package-agreements`
- `winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements`
- 「このアプリがデバイスに変更を加えることを許可しますか？」が出たら、受講生に「はい」を押してもらう
- **入れた直後はコマンドが見つからないことがある** → 受講生に Claude のアプリを完全に終了して開き直してもらい、「動画生成キットの続きをやって」と送ってもらう

### gTTS（Mac／Windows 共通）

- `python3 -m pip install --user gtts`（Windows は `python -m pip install --user gtts`）
- 「externally-managed-environment」というエラーが出たら `python3 -m pip install --user --break-system-packages gtts`
- 確認：`python3 -c "import gtts; print('ok')"` で `ok` と出ればOK

入れ終わったら、フェーズ1の表をもう一度確認して「全部そろいました」と伝える。

---

## フェーズ3：キットを作業フォルダに入れる

1. 作業フォルダの中（`.git` と `CLAUDE.md` があるフォルダ）にいることを確認する。違えば止まって、作業フォルダを開き直してもらう
2. キットをダウンロードして展開する：
   - Mac：
     ```
     mkdir -p .claude/skills
     curl -L -o /tmp/my-short-maker.zip https://ryoya9595.github.io/my-short-maker/my-short-maker.zip
     unzip -q -o /tmp/my-short-maker.zip -d .claude/skills/
     ```
   - Windows（PowerShell）：
     ```
     New-Item -ItemType Directory -Force .claude\skills | Out-Null
     curl.exe -L -o $env:TEMP\my-short-maker.zip https://ryoya9595.github.io/my-short-maker/my-short-maker.zip
     Expand-Archive -Force $env:TEMP\my-short-maker.zip .claude\skills\
     ```
3. `.claude/skills/my-short-maker/SKILL.md` があることを確認する
4. `.gitignore` に次の3行を足す（既存の内容は消さない）：
   ```
   .claude/skills/my-short-maker/output/
   .claude/skills/my-short-maker/app/node_modules/
   .claude/skills/my-short-maker/app/public/*.mp3
   ```
5. 動画の組み立て道具を入れる（1〜3分）：
   `cd .claude/skills/my-short-maker/app && npm install && cd ../../../..`

受講生に伝える：

> キットを入れました！次に、サンプルの台本で1本作って、ちゃんと動くか確かめます（3〜5分くらいかかります）。

---

## フェーズ4：サンプルで1本作って動作確認する

キットには最初からサンプルの台本（`script.json`）が入っている。それをそのまま使う。

1. `cd .claude/skills/my-short-maker && python3 scripts/generate.py`
   - 音声（mp3）と背景画像（jpg）が `app/public/` に作られる
   - 「背景の取得に失敗」が出ても止めない（混雑しているだけ。背景なしでも動画は作れる）
2. `cd app && npx remotion render src/index.ts FacelessShort ../output/short.mp4 && cd ..`
   - 初回は少し長い（1〜3分）。終わったら `output/short.mp4` ができる
3. 受講生に `output/short.mp4` を開いて再生してもらう（Mac：`open output/short.mp4`／Windows：`start output\short.mp4`）
4. 作業フォルダの一番上に戻る：`cd ../../..`（`ls` で `CLAUDE.md` が見えればOK）

> サンプルの動画ができました！再生してみてください。
> 音声・字幕・背景が入っていればOKです。

---

## フェーズ5：自分のテーマで1本作る

ここからは **SKILL.md の手順** に従う（`/my-short-maker` で呼び出せる）。

受講生にテーマを1つ聞く（例：「朝5分でできる片付けのコツ」）。台本が無ければ SKILL.md の型で6〜8シーンの台本を作って見せ、OKをもらってから `script.json` に書いて、フェーズ4と同じ手順で作る。

完成したら：

> できました！`output/` に動画が入っています。
> 「声をもう少しゆっくり」「文字の色を変えて」などの好みは `settings.json` に覚えさせるので、次からは全部の動画に反映されます。
> 動画ファイルは大きいので GitHub には上げません（パソコンの中に残ります）。キットの設定は「GitHubに上げて」で保存できます。

---

## 付録：うまくいかないとき

| 症状 | 原因 | 対処 |
|---|---|---|
| `ffprobe: command not found` | FFmpeg が入っていない／入れた直後 | フェーズ2。Windows はアプリを再起動 |
| `No module named gtts` | gTTS が入っていない | `python3 -m pip install --user gtts` |
| ログに `402` や「待機」が何度も出る | Pollinations の無料枠（15秒に1回）に当たっている | 正常。キットが自動で待って取り直す。何度やってもダメなら時間をおいて `generate.py` だけやり直す |
| 背景が真っ黒・グラデだけ（ログに `429` や timeout） | Pollinations が混雑 | 時間をおいて `generate.py` をやり直す。失敗しても動画は作れる |
| 音声ができない | ネット未接続・gTTS の一時障害 | 接続を確認して再実行 |
| `remotion` が見つからない | `npm install` 未実行 | フェーズ3の手順5 |
| 動画がとても長い・短い | 話速（speed）の設定 | `settings.json` の `speed`（1.5前後が目安） |
| Windows で文字化け | PowerShell のリダイレクト | ファイルの作成・編集は Write/Edit ツールで行う |
