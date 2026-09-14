# 居酒屋カラオケ玉の家

支給シート・ロゴ・写真をもとに制作。トップ／お料理・お酒／カラオケ・店内／店舗案内の4ページ構成です。

## ローカル確認

- `npm run build`: HTMLを生成（追加依存パッケージ不要）。
- `npm run dev`: http://127.0.0.1:4200/ で表示。
- `npm run verify`: ページ、素材、内部リンク、電話と主要情報を検証。
- `node scripts/verify.mjs http://127.0.0.1:4200/`: 実際に配信した内容を照合。

## 配信

サイト本体は `dist/` にあります。Cloudflare Pages等ではビルド `npm run build`、出力 `dist` を指定します。
リポジトリ直下をそのまま公開するとREADMEが表示されるため、GitHub Pagesでは必ず `dist/` を公開するActions設定を使用してください。
GitHubの保存先は https://github.com/crestix-company/TAMANOIE です。
ソースの保存とWebサイトの公開は別の操作です。今回のコミット・プッシュではGitHub PagesやCloudflareへのデプロイ、公開設定の変更は行っていません。

## 構成

- `scripts/build.mjs`: 共通部分と各ページのHTMLを生成。
- `dist/`: 配信するHTML・CSS・JavaScript・軽量化済み写真。画像とCSSもGitで管理するため、写真の原本や外部パッケージなしで再ビルドできます。
- `assets.json`: 画像の寸法と素材の対応。
- `scripts/verify.mjs`: 全ページ・内部リンク・画像・主要な店舗情報を検証。

検証状況は `QUALITY-CHECK.md` を参照してください。ヒアリング資料のリンクを含む制作メモとSites固有の設定はローカルに保管し、公開リポジトリには含めていません。
