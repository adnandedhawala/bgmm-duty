import { Card } from "antd";

export const CardWithTable = ({
  title,
  tableComponent: TableComponent,
  tableProps,
  extra,
}) => (
  <Card title={title} extra={extra}>
    <TableComponent {...tableProps} />
  </Card>
);
