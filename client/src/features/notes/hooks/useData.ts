import { useContext } from "solid-js";
import { DataContext, DataContextType } from "../context/dataContext";

const useData = () => useContext(DataContext) as DataContextType;
export default useData;
