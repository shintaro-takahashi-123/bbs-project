# bbs-project
DB APIのリンク
https://maeda-my-blog.microcms.io/create-api

# 掲示板ウェブアプリ（bbs-project）技術仕様および開発要件定義書

## 1. プロジェクト概要
* **目的:** コンテナ技術（Docker）の運用思想に基づき、スケーラブルかつセキュアなシンプルな掲示板（BBS）ウェブアプリケーションを構築する。
* **主要機能:** 投稿の閲覧、および新規投稿（画像なし、テキストと投稿者名のみ。両方必須入力）。
* **データ管理:** 状態（投稿データ）はコンテナ内に持たず、外部のHeadless CMS（microCMS）に集約するステートレス設計。

## 2. 技術スタック
| 領域 | 採用技術 | 選定理由・備考 |
| :--- | :--- | :--- |
| **フロントエンド & BFF** | Next.js (App Router), Tailwind CSS | サーバー側でのAPI隠蔽、SSRによる高速化、モダンなUI開発 |
| **データベース** | microCMS (API) | サーバーレスでJSONデータを管理。コンテナのステートレス化を実現 |
| **インフラ・プロキシ** | Docker Compose, Nginx | コンテナ間の関心の分離、通信の交通整理とセキュリティヘッダー付与 |
| **ベースOS (コンテナ)** | Ubuntu Server 22.04 LTS | インフラ構築の演習・学習を兼ねた堅牢なベースイメージの採用 |
| **バリデーション** | Zod | スキーマ駆動の厳格な入力チェック |
| **開発環境** | Windows, VS Code, Git | WSL2ベースのDocker Engineを利用 |

## 3. システムアーキテクチャ・コンテナ設計
「1コンテナ1プロセス」「関心の分離」の思想に基づき、以下の2コンテナ構成とする。

1. **`proxy` コンテナ (Nginx)**
   * **役割:** リバースプロキシ、セキュリティの第1防衛線。
   * **処理:** ユーザーからのアクセスを受け付け、レートリミットやセキュリティヘッダーを付与した上で、安全な通信のみをバックエンドのNext.jsへ流す。
2. **`frontend` コンテナ (Next.js)**
   * **役割:** アプリケーション本体、BFF (Backend For Frontend)。
   * **処理:** UIのレンダリングを行う。投稿時やデータ取得時は、Next.jsのServer Components / Server Actionsを利用してmicroCMSのAPIを叩く。ブラウザ側にはAPIキーを絶対に露出させない。
   * **セキュリティ:** Ubuntuコンテナ内では非rootユーザー（一般権限）を作成し、その権限でアプリケーションを起動する（最小権限の原則）。

## 4. セキュリティ・防衛線設計
* **インフラ層:** コンテナの非root実行。NginxによるDoS対策・クリックジャッキング対策。
* **アプリケーション層:** Next.js App Router（サーバー側）での環境変数（APIキー）の完全秘匿。
* **データ層:** Zodによる入力値の厳密な型チェックと文字数制限。Reactの標準機能によるXSS（クロスサイトスクリプティング）の無害化。

## 5. データベース設計（microCMS スキーマ予定）
microCMS上で以下のAPI（リスト形式）を作成する。
* API名: `posts`
* フィールド:
  * `author_name` (テキストフィールド): 必須、文字数制限（例: 1〜50文字）
  * `content` (テキストエリア): 必須、文字数制限（例: 1〜1000文字）

## 6. ディレクトリ構造（設計図）
```text
bbs-project/
├── docker-compose.yml       # コンテナ群のオーケストレーション定義
├── .env                     # 環境変数（microCMS APIキーなど。Git除外）
├── .gitignore               # Git管理から除外するファイル定義
├── proxy/
│   ├── Dockerfile           # Nginx用（Ubuntuベース）
│   └── default.conf         # Nginxルーティング・セキュリティ設定
└── frontend/
    ├── Dockerfile           # Next.js用（Ubuntuベース + Node.js + 非root設定）
    ├── package.json
    ├── tailwind.config.ts
    └── src/                 # Next.jsアプリケーションコード（App Router）