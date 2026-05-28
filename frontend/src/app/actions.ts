'use server';
/// <reference path="../types/next-cache.d.ts" />

import { client } from '../lib/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const endpoint = process.env.MICROCMS_ENDPOINT || 'bbs';

// バリデーションスキーマ
const postSchema = z.object({
  author_name: z.string().min(1, '名前を入力してください').max(50, '名前は50文字以内で入力してください'),
  content: z.string().min(1, '内容を入力してください').max(1000, '内容は1000文字以内で入力してください'),
});

// Stateの型定義
export type State = {
  errors?: {
    author_name?: string[];
    content?: string[];
  };
  message?: string | null;
};

// 投稿を作成
export async function createPost(prevState: State, formData: FormData): Promise<State> {
  const author_name = formData.get('author_name');
  const content = formData.get('content');

  // バリデーションの実行
  const validatedFields = postSchema.safeParse({
    author_name,
    content,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '入力内容にエラーがあります',
    };
  }

  try {
    await client.create({
      endpoint,
      content: {
        author_name: validatedFields.data.author_name,
        content: validatedFields.data.content
      },
    });

    revalidatePath('/'); // 画面を更新
    return { message: null };
  } catch (error) {
    return {
      message: '投稿の作成に失敗しました',
    };
  }
}

// 投稿を削除
export async function deletePost(id: string) {
  await client.delete({
    endpoint,
    contentId: id,
  });
  revalidatePath('/');
}