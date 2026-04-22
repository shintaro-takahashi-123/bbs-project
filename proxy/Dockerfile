FROM ubuntu:22.04

# タイムゾーン設定での対話プロンプトを回避
ENV DEBIAN_FRONTEND=noninteractive

# Nginxのインストール
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# デフォルトの設定ファイルを削除し、カスタム設定を配置
RUN rm /etc/nginx/sites-enabled/default
COPY default.conf /etc/nginx/conf.d/default.conf

# Nginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]