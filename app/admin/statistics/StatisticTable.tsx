import { Input, Space, Table, TableProps } from "antd";

const StatisticTable = () => {
    const columns: TableProps['columns'] = [
        {
            title: 'Avatar',
            dataIndex: 'image',
            key: 'image',
            
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Action',
            key: 'action',
            
        },
    ];


    return ( 
        <div className="pt-2 max-h-[400px]">
            <Space style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Input
                    placeholder="Search by name or email"
                    value={''}
                    onChange={() => {}}
                    style={{ width: 200 }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={[]}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
            />
        </div>
     );
}
 
export default StatisticTable;