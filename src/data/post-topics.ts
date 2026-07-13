import rawPostTopicKeys from "./post-topics.json";
import type { TopicKey } from "./topics";

const allowedTopicKeys: ReadonlySet<string> = new Set([
  "systems",
  "intelligence",
  "leadership",
  "products",
  "history",
]);

/** Stable taxonomy by content group. Translations must never infer different topics from localized prose. */
export const postTopicKeys: Readonly<Record<string, readonly TopicKey[]>> = Object.freeze(Object.fromEntries(
  Object.entries(rawPostTopicKeys).map(([translationKey, rawTopicKeys]) =>
  {
    if (rawTopicKeys.length === 0 || new Set(rawTopicKeys).size !== rawTopicKeys.length)
    {
      throw new Error(`Invalid stable topic assignment for ${translationKey}`);
    }

    const topicKeys = rawTopicKeys.map((topicKey) =>
    {
      if (!allowedTopicKeys.has(topicKey))
      {
        throw new Error(`Unknown topic key ${topicKey} for ${translationKey}`);
      }
      return topicKey as TopicKey;
    });

    return [translationKey, Object.freeze(topicKeys)] as const;
  }),
));
