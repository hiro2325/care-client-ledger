# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

介護利用者台帳（care-client-ledger）。利用者情報・サービス提供記録を管理するWebアプリケーション。

技術構成: **React + Vite + JavaScript**（TypeScriptは使用しない）

## 現状

2026-09-16 時点で、リポジトリは `git init` 済みだがソースコードは未スキャフォールド。
最初の実装時は以下でプロジェクトを生成する:

```powershell
npm create vite@latest . -- --template react
npm install
```

`--template react-ts` は使わないこと（このプロジェクトはJavaScriptで統一する）。

## コマンド

Vite標準のスクリプトを使う。

```powershell
npm run dev        # 開発サーバー起動
npm run build      # 本番ビルド
npm run preview    # ビルド結果のローカル確認
npm run lint       # ESLint
```

### テスト

テストランナーは未導入。導入する場合は Vitest（Viteと設定を共有できるため）:

```powershell
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm test                          # 全テスト
npx vitest run src/foo.test.jsx   # 単一ファイル
npx vitest run -t "テスト名"       # 単一テストケース
```

導入したらこのセクションを実際のスクリプト名で更新すること。

## Git運用ルール

**コードを変更するたびにGitHubへプッシュする。** これはこのプロジェクトの必須ルール。

- ファイルを編集・追加・削除したら、作業がひと区切りついた時点で必ず `git add` → `git commit` → `git push` まで実行する。ローカルにコミットを溜めない。
- 「後でまとめてプッシュ」はしない。1つの変更単位ごとにプッシュする。
- コミットメッセージは日本語で、何を変えたかが分かる1行で書く（例: `利用者一覧の検索フィルタを追加`）。
- ブランチは `main` を使用。
- push が失敗した場合（リモート未設定・認証エラー等）は握りつぶさず、ユーザーに状況を報告する。

基本フロー:

```powershell
git add -A
git commit -m "変更内容"
git push
```

### リモート未設定の場合

リモートはまだ設定されていない。初回に一度だけ:

**リポジトリは必ず Public で作成する**（提出課題の要件であり、GitHub Pages の無料プランが Public リポジトリのみ対応しているため）。

```powershell
gh repo create care-client-ledger --public --source=. --remote=origin --push
# または
git remote add origin <GitHubのURL>
git push -u origin main
```

## 注意事項

- このリポジトリは OneDrive 配下（`C:\Users\cuore\OneDrive\ドキュメント\care-client-ledger`）にある。OneDriveの同期と `node_modules` が競合しうるため、ビルドが不安定な場合はOneDrive同期の除外設定を疑う。
- 介護利用者の個人情報を扱うドメインのため、実データ・実氏名をリポジトリにコミットしない。サンプルデータは架空の値を使う。
