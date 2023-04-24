import React, { useContext, useState } from "react";

const TaskDetailsContext = React.createContext({
  currentTask: {},
  loading: false,
  setCurrentTask: () => {},
  setLoading: () => {},
  resetTaskDetails: () => {},
});

export const useTaskDetailsContext = () => {
  return useContext(TaskDetailsContext);
};

export const TaskDetailsProvider = ({ children }) => {
  const [currentTask, setCurrentTask] = useState({});
  const [loading, setLoading] = useState(false);

  const resetTaskDetails = () => {
    setCurrentTask({});
    setLoading(false);
  };

  return (
    <TaskDetailsContext.Provider
      value={{
        setCurrentTask: title => setCurrentTask(title),
        setLoading: title => setLoading(title),
        resetTaskDetails,
        currentTask,
        loading,
      }}
    >
      {children}
    </TaskDetailsContext.Provider>
  );
};

export default TaskDetailsContext;
