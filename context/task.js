import React, { useContext, useState } from "react";

const TaskContext = React.createContext({
  taskList: [],
  loading: false,
  setTaskList: () => {},
  setLoading: () => {},
  resetTaskList: () => {},
});

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [taskList, setTaskList] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const [loading, setLoading] = useState(false);

  const resetTaskList = () => {
    setTaskList([]);
    setLoading(false);
  };

  return (
    <TaskContext.Provider
      value={{
        setTaskList: title => setTaskList(title),
        setCurrentTask: title => setCurrentTask(title),
        setLoading: title => setLoading(title),
        resetTaskList,
        taskList,
        currentTask,
        loading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
