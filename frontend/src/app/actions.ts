'use server';
/// <reference path="../types/next-cache.d.ts" />

import { client } from '../lib/client';
import { revalidatePath } from 'next/cache';

const endpoint = process.env.MICROCMS_ENDPOINT || 'bbs';

// 投稿を作成
export async function createPost(formData: FormData) {
  const author_name = formData.get('author_name') as string;
  const content = formData.get('content') as string;

  await client.create({
    endpoint, // microCMSで作成したエンドポイント名に合わせてください
    content: { author_name, content },
  });

  revalidatePath('/'); // 画面を更新
}

// 投稿を削除
export async function deletePost(id: string) {
  await client.delete({
    endpoint,
    contentId: id,
  });
  revalidatePath('/');
}