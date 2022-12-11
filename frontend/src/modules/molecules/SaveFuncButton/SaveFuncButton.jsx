import { Save1, Save2, Save3 } from "../../atoms";

export const SaveFuncButton = ({ slot, saved, isSelected, ...restProps }) => {
  // console.log(slot);
  // alert(isSelected);
  if (slot === 0) {
    return <Save1 saved={saved} restProps={restProps} isSelected={isSelected}/>;
  } else if (slot === 1) {
    return <Save2 saved={saved} restProps={restProps}  isSelected={isSelected}/>;
  } else if (slot === 2) {
    return <Save3 saved={saved} restProps={restProps}  isSelected={isSelected}/>;
  }
};
