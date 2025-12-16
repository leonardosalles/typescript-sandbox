import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "db.json");

type Pipeline = {
  id: string;
  transformer: string;
};

type DBShape = {
  pipelines: Record<string, Pipeline>;
  flags: { name: string; condition: string }[];
};

function loadDb(): DBShape {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DBShape = {
      pipelines: {
        "1": {
          id: "1",
          transformer:
            "return { seenAt: Date.now(), payloadKeys: Object.keys(payload), payload }",
        },
      },
      flags: [{ name: "newParser", condition: "ctx.plan === 'enterprise'" }],
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }

  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDb(db: DBShape) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export const db = {
  pipeline: {
    find(id: string): Pipeline {
      const db = loadDb();
      return db.pipelines[id];
    },

    update(id: string, transformer: string) {
      const db = loadDb();
      db.pipelines[id].transformer = transformer;
      saveDb(db);
    },
  },

  flags: {
    list() {
      const db = loadDb();
      return db.flags;
    },
  },
};
