import { useContext } from "solid-js";
import { IndexedDBContext, IndexedDBContextType } from "../context/indexedDB";

const useIndexedDB = () => useContext(IndexedDBContext) as IndexedDBContextType;
export default useIndexedDB;
