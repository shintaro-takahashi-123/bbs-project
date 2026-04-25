import { client } from '../lib/client';
import { createPost, deletePost } from './actions';

const endpoint = process.env.MICROCMS_ENDPOINT || 'bbs';

export default async function Home() {
  let errorMessage = '';

  // 1. 読取 (Read)
  const data = await client.getList({ endpoint }).catch(() => {
    errorMessage = `microCMSの取得に失敗しました。エンドポイント "${endpoint}" を確認してください。`;
    return { contents: [] as any[] };
  });

  return (
    <main className="max-w-2xl mx-auto p-8 font-mono bg-white text-black">
      <h1 className="text-2xl font-bold border-b-2 border-black mb-8">BBS (SIMPLE CRUD)</h1>
      {errorMessage && <p className="mb-6 border border-red-500 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}

      {errorMessage ? null : (
        <>
      {/* 2. 作成 (Create) */}
      <form action={createPost} className="flex flex-col gap-4 mb-12 border-2 border-black p-4">
        <input name="author_name" placeholder="Name" required className="border border-black p-2 outline-none focus:bg-gray-100" />
        <textarea name="content" placeholder="Content" required className="border border-black p-2 outline-none focus:bg-gray-100" />
        <button className="bg-black text-white p-2 hover:bg-gray-800">POST</button>
      </form>

      {/* 一覧表示 */}
      <div className="space-y-6">
        {data.contents.map((post: any) => (
          <div key={post.id} className="border-l-4 border-black pl-4 py-2 flex justify-between items-start">
            <div>
              <p className="font-bold">[{post.author_name}]</p>
              <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
            </div>
            {/* 3. 削除 (Delete) */}
            <form action={async () => { 'use server'; await deletePost(post.id); }}>
              <button className="text-xs border border-black px-2 py-1 hover:bg-black hover:text-white">DEL</button>
            </form>
          </div>
        ))}
      </div>
        </>
      )}
    </main>
  );
}