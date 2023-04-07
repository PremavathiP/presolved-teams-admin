import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Col, Form, Row, Typography, Input, Select, Space, Modal, notification, Table } from 'antd';
import { UserAddOutlined, UserDeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { API, Auth } from "aws-amplify";
import './management.less';
import { getClientSignupUserList, createSignup } from '../api/index';

const { confirm } = Modal;

const TenantsManagement = () => {

    useEffect(() => {
        getTenantList();
    }, [])

    const apiName = "AdminQueries";
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [form] = Form.useForm();
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    //-----------------Get User List Functionalities---------------------------------

    const getTenantList = async () => {
        getClientSignupUserList().then((res) => {
            let data = res.listClientSignups.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                setData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    company: data[i].company,
                    tenantId: data[i].id,
                    email: data[i].email,
                    phone: data[i].phone
                }])
                setTableData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    company: data[i].company,
                    tenantId: data[i].id,
                    email: data[i].email,
                    phone: data[i].phone
                }])
            }
        }).catch((err) => {
            notification.error({
                message: 'Error',
                description: 'Error while fetching list'
            })
        })
    }


    //-------------------Create User Functionalities-------------

    const showCreateModal = () => {
        setCreateModalVisible(true)
    }

    const handleCreateSubmit = (values) => {
        setCreateModalVisible(false)
        createTenant(values)
    }

    const handleCreateCancel = () => {
        setCreateModalVisible(false)
        form.resetFields()
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const randomPasswordGenerator = () => {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }



    async function createTenant(values) {
        //Get Values from form

        const name = values.name;
        const email = values.email;
        const password = randomPasswordGenerator();
        const role = "tenantAdmin";
        const phone = values.phone
        const company = values.company
        console.log('password',password)
        const path = "/users";

        const myInit = {
            body: {
                username: email,
                email: email,
                password: password,
                groupname: role,
                userAttributes: JSON.stringify([
                    {
                        Name: "name",
                        Value: name,
                    },
                    // {
                    //     Name: "company",
                    //     Value: company,
                    // },
                    {
                         Name: "phone_number",
                         Value: phone,
                     },
                    {
                        Name: "custom:tenantId",
                        Value: "tenantId1",
                    },
                ]),
            },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        };
        API.post(apiName, path, myInit)
            .then((response) => {
                console.log("Response from CreateTenant API in Cognito is ", response);
                // if signup is successful in cognito, create a signup record in dynamodb
                createSignup({
                    name: name,
                    company: company,
                    email: email,
                    phone: phone,
                    role: role,
                }).then((data) => {
                    notification.success({
                        message: 'Success',
                        description: 'Please check your email for verification code'
                    })
                }).catch((err) => {
                    throw err;
                })
                setTableData([]);
                getTenantList();
                form.resetFields()
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
    //----------------Remove User functionalities-----------------------------
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows)
        },
    };


    const removeTenant = async (selectedRow, check) => {

        var role = 'tenantAdmin';
        var username = selectedRow.email;
        const path = "/removeUserFromGroup";
        const myInit = {
            body: {
                username: username,
                groupname: role
            },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        };
        API.post(apiName, path, myInit)
            .then((response) => {
                console.log("Response from RemoveTenant API is ", response);
                if (!check)
                    notification.info({
                        message: 'Success',
                        description: 'Tenant removed successfully',
                    });
                if (check)
                    addTenantToGroup(username, selectedRow.newRole)
                else {
                    setTableData([]);
                    getTenantList();
                }
            }).catch((error) => {
                console.log(error.response);
            });

    }

    const showRemoveConfirm = () => {
        if (selectedRow !== null) {
            confirm({
                title: 'Are you sure remove this tenant?',
                icon: <ExclamationCircleFilled />,
                content: 'Tenant will be removed from these groups.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    console.log('OK');
                    removeTenant(selectedRow[0], false);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        else (
            notification.error({
                message: 'Error',
                description: 'Please select the tenant to remove'
            })
        )
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Tenant Id',
            dataIndex: 'tenantId',
            key: 'tenantId',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];

    return (
        <div className='content-container'>
            <div className='main-container'>
                <Row className='breadcrumb-container'>
                    <Col span={24}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Super-admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Tenants</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
                <Row className='topic-container' justify="space-between">
                    <Typography.Title level={3} > Tenants Management </Typography.Title>
                    <Space>
                        <Input
                            placeholder="Search here"
                            value={searchValue}
                            onChange={e => {
                                const currValue = e.target.value;
                                setSearchValue(currValue);
                                const filteredData = data.filter(entry =>
                                    entry.email.toLowerCase().includes(currValue.toLowerCase()) ||
                                    entry.name.toLowerCase().includes(currValue.toLowerCase()) ||
                                    entry.company.toLowerCase().includes(currValue.toLowerCase()) ||
                                    entry.tenantId.toLowerCase().includes(currValue.toLowerCase())
                                );
                                setTableData(filteredData);
                            }}
                        />
                        <Button type='primary' size='large' onClick={showCreateModal}><UserAddOutlined />Add</Button>
                        <Button type='primary' size='large' onClick={showRemoveConfirm}><UserDeleteOutlined />Disable</Button>
                    </Space>
                </Row>
                <Row >
                    <Col className='table-container'>
                        <Table
                            rowSelection={{
                                type: 'radio',
                                ...rowSelection,
                            }}
                            bordered
                            columns={columns}
                            dataSource={tableData}

                        />
                    </Col>
                </Row>
                <Modal
                    title={<h3>Onboarding Tenant</h3>}
                    className='CreateModal'
                    open={createModalVisible}
                    onOk={form.submit}
                    onCancel={handleCreateCancel}
                    footer={[
                        <Button
                            type="default"
                            onClick={handleCreateCancel}
                        >
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={form.submit}>
                            Save
                        </Button>
                    ]}
                >
                    <Form
                        form={form}
                        name="createForm"
                        labelCol={{
                            span: 12,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: '100%',
                        }}
                        onFinish={handleCreateSubmit}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout='vertical'
                    >

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide your name!',
                                },
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Company"
                            name="company"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide your company!',
                                },
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please provide your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label='Phone # with country code (Eg:+1)'
                            name='phone'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your company Phone!'
                                },
                                {
                                    pattern: new RegExp(/^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/),
                                    message: 'Please input a valid phone number!'
                                }
                            ]}>
                            <Input datatype='number' />
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        </div>
    );
}

export default TenantsManagement;