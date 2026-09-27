import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();

  useEffect(() => {}, []);
  return <div>ProjectDetails</div>;
};

export default ProjectDetails;
