import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const metadataFileName = ".DS_Store";
const roots = ["public", "dist"] as const;
let removedFileCount = 0;

for (const root of roots)
{
  await removeFinderMetadata(root);
}

console.log(`Removed ${removedFileCount} Finder metadata file(s)`);

async function removeFinderMetadata(directoryPath: string): Promise<void>
{
  const entries = await readdir(directoryPath, { withFileTypes: true }).catch((error: unknown) =>
  {
    if (error instanceof Error && "code" in error && error.code === "ENOENT")
    {
      return [];
    }

    throw error;
  });

  for (const entry of entries)
  {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory())
    {
      await removeFinderMetadata(entryPath);
    }
    else if (entry.name === metadataFileName)
    {
      await rm(entryPath);
      removedFileCount += 1;
    }
  }
}
