import { Input } from "reactstrap";
import classes from "./TagFilter.module.css";
const TagFilter = (props) => {
  const filterTags = (event) => {
    
    props.tagsFiltering(event.target.value);
  };
  return <Input onChange={filterTags} placeholder="Filter Tags..."></Input>;
};

export default TagFilter;
