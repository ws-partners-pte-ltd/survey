# WSP Radar Survey Site

`survey.ws-partners.com.sg`（GitHub Pages, 組織 `ws-partners-pte-ltd` / リポジトリ `survey`）。

サーベイは**完全な静的サイト**です。React/ReactDOM はバージョン固定でローカル同梱し、JSXは事前コンパイル済み（`app.js`）。ブラウザは外部CDNのBabelを読み込みません（CDN更新で画面が真っ白になる事故の防止）。

## ディレクトリ構成

```
survey/                              ← survey.ws-partners.com.sg
├── CNAME                            survey.ws-partners.com.sg（GitHub Pagesカスタムドメイン）
├── .nojekyll                        Jekyll無効化（静的ファイルをそのまま配信）
├── assets/                          共通ライブラリ（CDN非依存）
│   ├── react.production.min.js          React 18.3.1（固定）
│   └── react-dom.production.min.js       ReactDOM 18.3.1（固定）
├── favicon.png / apple-touch-icon.png
│
├── organization/                    ★組織最適化サーベイ（組織）
│   └── <country>/<company>/<year>/  index.html, app.js, config.js
│       例: indonesia/sample/2026/
│
├── individual/                      ★強み解放サーベイ（個人）
│   └── <country>/<company>/<year>/  index.html, app.js, config.js
│       例: indonesia/sample/2026/
│
└── tools/                           運用ツール（サイト表示には不要）
    ├── new-engagement.js            新規案件フォルダ生成
    ├── build.js                     JSX事前コンパイル
    ├── package.json
    └── templates/
        ├── organization/  index.html, app.js, app.src.jsx, config.js  （共通エンジン）
        └── individual/    index.html, app.js, app.src.jsx, config.js
```

階層は **サービス（organization / individual）→ 国 → 企業 → 年度**。
URL例: `https://survey.ws-partners.com.sg/organization/indonesia/acme/2026/`

## 新しい案件を追加する

```bash
node tools/new-engagement.js \
  --service organization --country indonesia --company acme --year 2026 \
  --company-name "PT ACME Indonesia"
```

`<service>/<country>/<company>/<year>/` を生成し、`config.js` の `PROJECT_ID` と `COMPANY` を自動設定します。
対応サービス: `organization`（組織最適化）/ `individual`（強み解放）。
対応国コード: indonesia/thailand/vietnam/singapore/malaysia/japan/philippines。

> `PROJECT_ID` は**年度を含めません**（`<SERVICE>_<COMPANY>_<国コード>`）。同一サービス×企業の回答を
> 年度をまたいで同じスプレッドシートに蓄積し、経年比較できるようにするためです。年度はフォルダ／URLで分けます。

公開（デプロイ）はGit:
```bash
git add -A && git commit -m "add organization/indonesia/acme/2026" && git push
```

## エンジン（画面の挙動）を変えたとき＝再ビルド

`tools/templates/<service>/app.src.jsx` を編集したら、デプロイ前に再ビルドが必要です（`config.js` だけの変更や新規案件追加では不要）。

```bash
cd tools
npm install        # 初回のみ（@babel/core, @babel/preset-react）
node build.js      # テンプレ＋全案件フォルダの app.js を最新エンジンに同期
```

`build.js` は `app.src.jsx` を `React.createElement` 形式（`import` 無し）にコンパイルし、
各サービス配下の全案件フォルダの `app.js` も同じ内容に上書き同期します。

## 厳守ルール（重要）

- **ブラウザ内Babel（`@babel/standalone` のCDN読み込み・`type="text/babel"`）は使わない。** 必ず事前コンパイル。
- **React/ReactDOM は `assets/` のローカル同梱を使う**（外部CDNを実行時に読み込まない）。
- 詳細な背景は survey-generator スキルの `references/web-survey-deploy-guardrail.md` を参照。
