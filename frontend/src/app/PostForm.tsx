'use client';

import { useActionState } from 'react';
import { createPost, State } from './actions';

export default function PostForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(createPost, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 mb-12 border-2 border-black p-4">
      {state.message && (
        <p className="border border-red-500 bg-red-50 p-2 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div>
        <input
          name="author_name"
          placeholder="Name"
          className="w-full border border-black p-2 outline-none focus:bg-gray-100"
        />
        {state.errors?.author_name && (
          <p className="text-red-500 text-xs mt-1">{state.errors.author_name[0]}</p>
        )}
      </div>

      <div>
        <textarea
          name="content"
          placeholder="Content"
          className="w-full border border-black p-2 outline-none focus:bg-gray-100 h-32"
        />
        {state.errors?.content && (
          <p className="text-red-500 text-xs mt-1">{state.errors.content[0]}</p>
        )}
      </div>

      <button
        disabled={isPending}
        className="bg-black text-white p-2 hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isPending ? 'POSTING...' : 'POST'}
      </button>
    </form>
  );
}
