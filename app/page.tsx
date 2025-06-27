// app/page.tsx
'use client';

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Home() {
  const [log, setLog] = useState<string[]>([]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const key = `uploads/${file.webkitRelativePath || file.name}`;
      const task = uploadBytesResumable(ref(storage, key), file);

      task.on(
        'state_changed',
        snap =>
          setLog(l => [`${key} ${(snap.bytesTransferred / snap.totalBytes * 100).toFixed(1)}%`, ...l]),
        err => setLog(l => [`❌ ${key} ${err.message}`, ...l]),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setLog(l => [`✅ ${key}`, ...l]);
          console.log(url);
        }
      );
    }
  }

  return (
    <main className="p-8 space-y-4">
      <label className="block cursor-pointer border-2 border-dashed p-8 text-center">
        <span className="font-semibold">Choose a folder</span>
        <input type="file" webkitdirectory="true" multiple hidden onChange={onPick} />
      </label>

      <ul className="font-mono text-sm space-y-1">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </main>
  );
}