import { useParams } from "react-router-dom";
import { useTaskStore } from "../../stores/taskStore";

const TaskDetails = () => {
  const { id } = useParams();
  const { getTaskById } = useTaskStore();

  console.log("Task ID:", id);
  return <div>Task Details</div>;
};

export default TaskDetails;
