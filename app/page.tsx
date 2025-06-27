'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';

export default function Home() {
  const [log, setLog] = useState<string[]>([]);
  const [files, setFiles] = useState<{ name: string, url: string }[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // 1. Upload all files, preserve structure
  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const key = `uploads/${file.webkitRelativePath || file.name}`;
      const task = uploadBytesResumable(ref(storage, key), file);

      task.on(
        'state_changed',
        snap => setLog(l => [`${key} ${(snap.bytesTransferred / snap.totalBytes * 100).toFixed(1)}%`, ...l]),
        err => setLog(l => [`❌ ${key} ${err.message}`, ...l]),
        async () => {
          setLog(l => [`✅ ${key}`, ...l]);
          // Refresh file list after upload
          fetchFiles();
        }
      );
    }
  }

  // 2. List all files in /uploads
  async function fetchFiles() {
    setLoadingList(true);
    const dirRef = ref(storage, 'uploads');
    let entries: { name: string, url: string }[] = [];
    try {
      // listAll is shallow—so recursively fetch, or use flat uploads.
      const traverse = async (prefixRef: any, parent = '') => {
        const res = await listAll(prefixRef);
        for (let f of res.items) {
          const url = await getDownloadURL(f);
          entries.push({ name: parent + f.name, url });
        }
        for (let f of res.prefixes) {
          await traverse(f, parent + f.name + '/');
        }
      };
      await traverse(dirRef);
    } catch (e) {
      setLog(l => [`❌ List error: ${String(e)}`, ...l]);
    }
    setFiles(entries);
    setLoadingList(false);
  }

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="p-8 space-y-4">
      <label className="block cursor-pointer border-2 border-dashed p-8 text-center">
        <span className="font-semibold">Choose a folder</span>
        <input type="file" webkitdirectory="true" multiple hidden onChange={onPick} />
      </label>

      <ul className="font-mono text-sm space-y-1">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>

      <hr />
      <h3 className="font-bold mb-2">Uploaded Files:</h3>
      {loadingList ? <div>Loading…</div> : null}
      <ul className="space-y-1">
        {files.map((f, i) => (
          <li key={i}>
            <a href={f.url} target="_blank" rel="noopener noreferrer" download>
              {f.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}