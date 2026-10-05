import { useEffect } from "react";
import { useTaskStore } from "../../stores/taskStore";

const Tasks = () => {
  const { tasks, fetchAllTasks } = useTaskStore();
  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);
  console.log(tasks);

  return <div>Tasks</div>;
};

export default Tasks;
