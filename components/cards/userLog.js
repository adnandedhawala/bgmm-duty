import { Card, Tag } from "antd";
import moment from "moment";

export const UserLogCard = ({ title, name, userRole, time }) => (
  <Card className="mb-2" bodyStyle={{ padding: "10px" }}>
    <span className="text-sm font-light">{title + " : " + name}</span>
    <div className="mt-1 flex items-center text-xs justify-between font-light">
      <Tag className="text-xs">{userRole.split("_").join(" ")}</Tag>
      <span>{moment(time).format("DD-MM-YYYY hh:mm:ss A")}</span>
    </div>
  </Card>
);
