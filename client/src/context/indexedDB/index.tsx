import { createContext, createSignal, JSXElement, onCleanup, Show, useContext } from "solid-js";

type IndexedDBContextReturn = [
  <T>(name: string) => StoreOperations<T>,
  {
    transaction: (name: string | Iterable<string>, mode: Exclude<IDBTransactionMode, "versionchange">) => Promise<IDBTransaction>
    deleteDatabase: () => Promise<void>,
    clearDatabase: () => Promise<void>;
  }
]

export const IndexedDBContext = createContext<IndexedDBContextReturn>([] as any);

export interface StoreSchema {
  name: string,
  options?: {
    keyPath?: string,
    autoIncrement?: boolean
  },
  index?: {
    name: string,
    keyPath: string,
    options?: {
      unique?: boolean,
      multiEntry?: boolean
    },
  }[]
}

export type Key = IDBValidKey | IDBKeyRange;

export interface StoreOperations<T> {
  add: (data: T, key?: Exclude<Key, IDBKeyRange>) => Promise<Key>;
  put: (data: T, key?: Exclude<Key, IDBKeyRange>) => Promise<Key>;
  get: (key: Key) => Promise<T>;
  getAll: (key?: Key, count?: number) => Promise<T[]>;
  getKey: (key: Key) => Promise<Exclude<Key, IDBKeyRange> | undefined>;
  getAllKeys: (key?: Key, count?: number) => Promise<Key[]>;
  delete: (key: Key) => Promise<undefined>;
  count: (key?: Key) => Promise<number>;
  clear: () => Promise<undefined>;
  transaction: (name: string | Iterable<string>, mode: Exclude<IDBTransactionMode, "versionchange">) => Promise<IDBTransaction>;
}

interface IndexedDBProps {
  value: {
    name: string,
    version: number,
    stores: StoreSchema[],
  }
  children: JSXElement;
}

export default function IndexedDBProvider(props: IndexedDBProps) {
  const { name, version, stores } = props.value;
  const [database, setDatabase] = createSignal<IDBDatabase>();

  const iDBRequest = indexedDB.open(name, version)

  iDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const request = event.target as IDBRequest;
    const iDB = request.result;

    for (const storeName of iDB.objectStoreNames) {
      if (stores.every(store => store.name !== storeName)) {
        iDB.deleteObjectStore(storeName);
      }
    }

    for (const store of stores) {
      if (!iDB.objectStoreNames.contains(store.name)) {
        iDB.createObjectStore(store.name, store?.options);
      }

      const currentStore = request.transaction!.objectStore(store.name);

      for (const currentIndex of currentStore.indexNames) {
        if (!store?.index?.some(index => index.name == currentIndex)) {
          currentStore.deleteIndex(currentIndex);
        }
      }

      store?.index?.forEach(index => {
        if (!currentStore.indexNames.contains(index.name)) {
          currentStore.createIndex(index.name, index.keyPath, index?.options)
        }
      })
    }
  }

  iDBRequest.onsuccess = (event: Event) => {
    const iDB = (event.target as IDBOpenDBRequest).result;
    setDatabase(iDB);

    iDB.onversionchange = () => {
      iDB.close();

      window.location.reload();
    }
  }

  iDBRequest.onerror = (event: Event) => {
    console.error("Error on open IndexedDB:", (event.target as IDBOpenDBRequest).error);
  }

  function transaction(name: string | Iterable<string>, mode: Exclude<IDBTransactionMode, "versionchange">): Promise<IDBTransaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const transaction = database()!.transaction(name, mode);
        transaction.onabort
        
        transaction.onerror = () => {
          throw transaction.error;
        }

        resolve(transaction);
      } catch (error) {
        reject(error);
      }
    })
  }

  function useStore<T>(name: string): StoreOperations<T> {
    if (!stores.find((value) => value.name === name)) {
      throw new Error(`Object store "${name}" not found.`);
    }

    function add(data: T, key?: Exclude<Key, IDBKeyRange>): Promise<Key> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readwrite")).objectStore(name);
          const storeRequest = store.add(data, key);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function put(data: T, key?: Exclude<Key, IDBKeyRange>): Promise<Key> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readwrite")).objectStore(name);
          const storeRequest = store.put(data, key);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function get(key: Key): Promise<T> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readonly")).objectStore(name);
          const storeRequest = store.get(key);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function getAll(key?: Key, count?: number): Promise<T[]> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readonly")).objectStore(name);
          const storeRequest = store.getAll(key, count);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function getKey(key: Key): Promise<Exclude<Key, IDBKeyRange> | undefined> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readonly")).objectStore(name);
          const storeRequest = store.getKey(key);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function getAllKeys(key?: Key, count?: number): Promise<Key[]> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readwrite")).objectStore(name);
          const storeRequest = store.getAllKeys(key, count);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function del(key: Key): Promise<undefined> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readwrite")).objectStore(name);
          const storeRequest = store.delete(key);

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function count(): Promise<number> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readwrite")).objectStore(name);
          const storeRequest = store.count();

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    function clear(): Promise<undefined> {
      return new Promise(async (resolve, reject) => {
        try {
          const store = (await transaction(name, "readwrite")).objectStore(name);
          const storeRequest = store.clear();

          storeRequest.onsuccess = () => {
            resolve(storeRequest.result);
          }

          storeRequest.onerror = () => {
            throw storeRequest.error;
          }
        } catch (error) {
          reject(error);
        }
      });
    }

    return {
      transaction,
      add,
      put,
      get,
      getAll,
      getKey,
      getAllKeys,
      delete: del,
      count,
      clear
    }
  }

  async function clearDatabase(): Promise<void> {
    try {
      for (const store of stores) {
        const currentStore = useStore(store.name);
        await currentStore.clear();
      }
    } catch (error) {
      throw error;
    }
  }

  async function deleteDatabase(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (database()) {
          database()!.close();
        }

        const request = indexedDB.deleteDatabase(name);

        request.onsuccess = () => {
          resolve();
        }

        request.onerror = () => {
          throw request.error;
        };
      } catch (error) {
        reject(error);
      }
    })
  }

  onCleanup(() => database()?.close());

  return (
    <IndexedDBContext.Provider value={[useStore, { transaction, deleteDatabase, clearDatabase }]}>
      <Show when={database()}>
        {props.children}
      </Show>
    </IndexedDBContext.Provider>
  );
}

export const useIndexedDB = () => useContext(IndexedDBContext) as unknown as IndexedDBContextReturn;