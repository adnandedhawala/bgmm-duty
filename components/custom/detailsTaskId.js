import { ScheduleTwoTone } from "@ant-design/icons";

export const DetailsTaskId = ({ value }) => (
  <div className="flex items-center">
    <span className="text-2xl mr-2">
      <ScheduleTwoTone />
    </span>
    <span className="text-lg uppercase">{value}</span>
  </div>
);
