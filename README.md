# 居酒屋カラオケ玉の家

支給シート・ロゴ・写真をもとに制作。トップ／お料理・お酒／カラオケ・店内／店舗案内の4ページ構成です。

**サイトのURL： https://crestix-company.github.io/TAMANOIE/**

## ローカル確認

- `npm run build`: HTMLを生成（追加依存パッケージ不要）。
- `npm run dev`: http://127.0.0.1:4200/ で表示。
- `npm run verify`: ページ、素材、内部リンク、電話と主要情報を検証。
- `npm run verify:pages`: GitHub Pagesと同じ `/TAMANOIE/` 配下で全ページと素材を実配信照合。
- `node scripts/verify.mjs http://127.0.0.1:4200/`: 実際に配信した内容を照合。

## 配信

サイト本体は `dist/` にあります。Cloudflare Pages等ではビルド `npm run build`、出力 `dist` を指定します。
GitHub Pagesでは `.github/workflows/pages.yml` が `main` へのプッシュごとにビルド・検証し、`dist/` のみを公開します。Settings → Pages → Source は **GitHub Actions** を使用します。ブランチ直下の公開に戻すとREADMEが表示されるため、変更しないでください。
GitHubの保存先は https://github.com/crestix-company/TAMANOIE です。
公開完了はActionsのデプロイ成功と `node scripts/verify.mjs https://crestix-company.github.io/TAMANOIE/` の成功で判定します。プッシュ完了だけでは公開完了と扱いません。

## 構成

- `scripts/build.mjs`: 共通部分と各ページのHTMLを生成。
- `dist/`: 配信するHTML・CSS・JavaScript・軽量化済み写真。画像とCSSもGitで管理するため、写真の原本や外部パッケージなしで再ビルドできます。
- `assets.json`: 画像の寸法と素材の対応。
- `scripts/verify.mjs`: 全ページ・内部リンク・画像・主要な店舗情報を検証。

検証状況は `QUALITY-CHECK.md` を参照してください。ヒアリング資料のリンクを含む制作メモとSites固有の設定はローカルに保管し、公開リポジトリには含めていません。
