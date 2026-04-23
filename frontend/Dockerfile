FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 1. 必須パッケージのインストール (解凍用の xz-utils を追加)
RUN apt-get update && apt-get install -y \
    curl \
    xz-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Node.js (v20) のバイナリを直接ダウンロードして配置 (SSLエラーを -k で完全回避)
RUN curl -fsSLk https://nodejs.org/dist/v20.12.2/node-v20.12.2-linux-x64.tar.xz -o node.tar.xz \
    && tar -xJf node.tar.xz -C /usr/local --strip-components=1 \
    && rm node.tar.xz

# 3. セキュリティ対策: 非rootユーザーの作成
RUN groupadd -r bbsgroup && useradd -r -g bbsgroup -m bbsuser

# 4. 作業ディレクトリの設定と権限付与
WORKDIR /app
RUN chown -R bbsuser:bbsgroup /app

# 5. 非rootユーザーへ切り替え
USER bbsuser

# 6. コンテナ維持設定
CMD ["sleep", "infinity"]

EXPOSE 3000