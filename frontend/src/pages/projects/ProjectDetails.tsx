import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {}, []);
  return <div>ProjectDetails</div>;
};

export default ProjectDetails;
