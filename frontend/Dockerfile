FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 必要なパッケージとNode.js (v20) のインストール
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# セキュリティ対策: 非rootユーザー（bbsuser）の作成
RUN groupadd -r bbsgroup && useradd -r -g bbsgroup -m bbsuser

# 作業ディレクトリの設定
WORKDIR /app

# ディレクトリの所有者をbbsuserに変更
RUN chown -R bbsuser:bbsgroup /app

# 以降のコマンドは非rootユーザーで実行
USER bbsuser

EXPOSE 3000