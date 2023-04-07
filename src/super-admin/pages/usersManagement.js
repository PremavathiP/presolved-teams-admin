import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Layout,
  ConfigProvider,
  Form,
  Row,
  Typography,
  Switch,
  Slider,
  Input,
  Select,
  theme,
  Space,
  Alert,
  Menu,
  Tabs,
  Modal,
  notification,
  Table,
  Spin,
} from "antd";
import { Link, navigate } from "@gatsbyjs/reach-router";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { API, Auth } from "aws-amplify";
import "./management.less";
import { createAuditRecord } from "../../api/auditAPI";

const { confirm } = Modal;

const UsersManagement = () => {
  useEffect(() => {
    getUsersList();
  }, []);

  const apiName = "AdminQueries";
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    role: "",
    key: "",
  });
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  const mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );

  //-----------------Get User List Functionalities---------------------------------

  const getUsersList = async () => {
    const path = "/listUsers";
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };

    API.get(apiName, path, myInit)
      .then((response) => {
        console.log("Response from ListUsers API is ", response.Users);

        //Data for grid view
        for (let i = 0; i < Object.keys(response.Users).length; i++) {
          let attributes = response.Users[i].Attributes;
          var name = getName(attributes);
          var email = getEmail(attributes);
          getlistGroupsForUser(response.Users[i].Username, email, name);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const getEmail = (attributes) => {
    for (let j = 0; j < Object.keys(attributes).length; j++) {
      if (attributes[j].Name == "email") {
        return attributes[j].Value;
      }
    }
  };

  const getName = (attributes) => {
    for (let j = 0; j < Object.keys(attributes).length; j++) {
      if (attributes[j].Name == "name") {
        return attributes[j].Value;
      }
    }
  };

  const getlistGroupsForUser = async (username, email, name) => {
    const path = "/listGroupsForUser";
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      queryStringParameters: {
        username: username,
      },
    };

    API.get(apiName, path, myInit)
      .then((response) => {
        console.log("Response from listGroupsForUser API is ", response);
        var role = "";
        if (response.Groups[0].GroupName === "p3fAdmin") role = "Admin";
        else if (response.Groups[0].GroupName === "p3fSupport")
          role = "Support User";
        else {
          role = null;
        }
        if (role !== null) {
          setData((prev) => [
            ...prev,
            {
              key: username,
              name: name,
              email: email,
              role: role,
            },
          ]);
          setTableData((prev) => [
            ...prev,
            {
              key: username,
              name: name,
              email: email,
              role: role,
            },
          ]);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  //-------------------Create User Functionalities-------------

  const showCreateModal = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = (values) => {
    console.log(values);
    setCreateModalVisible(false);
    createUser(values);
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function createUser(values) {
    //Get Values from form
    console.log("values", values);
    const name = values.name;
    const email = values.email;
    const password = values.password;
    const role = values.role;
    const phone = "+919655678788";

    const path = "/users";

    const myInit = {
      body: {
        
        username: email,
        email: email,
        password: password,
        groupname: role,
        userAttributes: JSON.stringify([
          {
               Name: "phone_number",
               Value: phone,
          },
          {
            Name: "name",
            Value: name,
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
      .then(async (response) => {
        console.log("Response from CreateUser API is ", response);
        notification.success({
          message: "Success",
          description: "User created successfully",
        });

        //Add an entry to audit table
        let loggedUser = Auth.currentAuthenticatedUser();

        let changesMade = {
          oldValue: name,
          newValue: email,
          field: "email",
        };

        let auditRecord = {
          tenantId: "P3Fusion",
          resource: "AdminUserManagement",
          action: "CreateUser",
          byUser: loggedUser,
          byDateTime: new Date().toISOString(),
          changesMade: changesMade,
        };

        await createAuditRecord(auditRecord);

        setTableData([]);
        getUsersList();
        form.resetFields();
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  //----------------Remove User functionalities-----------------------------
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows);
    },
  };

  const removeUser = async (selectedRow, check) => {
    var role = selectedRow.role;
    var username = selectedRow.email;
    if (selectedRow.role === "Admin") role = "p3fAdmin";
    else if (selectedRow.role === "Support User") role = "p3fSupport";

    const path = "/removeUserFromGroup";
    const myInit = {
      body: {
        username: username,
        groupname: role,
      },
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    API.post(apiName, path, myInit)
      .then((response) => {
        console.log("Response from RemoveUser API is ", response);
        if (!check)
          notification.info({
            message: "Success",
            description: "User removed successfully",
          });
        if (check) addUserToGroup(username, selectedRow.newRole);
        else {
          setTableData([]);
          getUsersList();
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const showRemoveConfirm = () => {
    if (selectedRow !== null) {
      confirm({
        title: "Are you sure remove this user?",
        icon: <ExclamationCircleFilled />,
        content: "User will be removed from these groups.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          console.log("OK");
          removeUser(selectedRow[0], false);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else
      notification.error({
        message: "Error",
        description: "Please select the user to remove",
      });
  };
  //----------------------Update User Functionalities--------------------------------------------------

  const showEditModal = () => {
    setEditModalVisible(true);
  };

  const addUserToGroup = async (username, role) => {
    const path = "/addUserToGroup";

    const myInit = {
      body: {
        username: username,
        groupname: role,
      },
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    API.post(apiName, path, myInit)
      .then((response) => {
        console.log("Response from addUser API is ", response);
        notification.success({
          message: "Success",
          description: "User added successfully",
        });
        setTableData([]);
        getUsersList();
        formEdit.resetFields();
        setFormValues([]);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const UpdateUserRole = async (values) => {
    var username = formValues.email;
    var role = values.role;
    // removing user from the previous group
    let selectedRow = { email: username, role: formValues.role, newRole: role };
    removeUser(selectedRow, true);
  };

  const handleEditSubmit = (values) => {
    setEditModalVisible(false);
    UpdateUserRole(values);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    formEdit.resetFields();
    setFormValues([]);
  };

  //------------------------------------------------------------

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, record) => (
        <a
          onClick={() => {
            showEditModal();
            setFormValues({
              email: record.email,
              name: record.name,
              role: record.role,
              key: record.key,
            });
          }}
        >
          {record.name}
        </a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  return (
    <div className="content-container">
      <div className="main-container">
        <Row className="breadcrumb-container">
          <Col span={24}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Super-admin</Breadcrumb.Item>
              <Breadcrumb.Item>Users</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="topic-container" justify="space-between">
          <Typography.Title level={3}> Presolved Users </Typography.Title>
          <Space>
            <Input
              placeholder="Search here"
              value={searchValue}
              onChange={(e) => {
                const currValue = e.target.value;
                setSearchValue(currValue);
                const filteredData = data.filter(
                  (entry) =>
                    entry.email
                      .toLowerCase()
                      .includes(currValue.toLowerCase()) ||
                    entry.role
                      .toLowerCase()
                      .includes(currValue.toLowerCase()) ||
                    entry.name.toLowerCase().includes(currValue.toLowerCase())
                );
                setTableData(filteredData);
              }}
            />
            <Button type="primary" size="large" onClick={showCreateModal}>
              <UserAddOutlined />
              Add
            </Button>
            <Button type="primary" size="large" onClick={showRemoveConfirm}>
              <UserDeleteOutlined />
              Remove
            </Button>
          </Space>
        </Row>
        <Row>
          <Col className="table-container">
            <Table
              rowSelection={{
                type: "radio",
                ...rowSelection,
              }}
              bordered
              columns={columns}
              dataSource={tableData}
            />
          </Col>
        </Row>
        <Modal
          title={<h2> Create User</h2>}
          className="CreateModal"
          open={createModalVisible}
          onOk={form.submit}
          onCancel={handleCreateCancel}
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
              maxWidth: "100%",
            }}
            onFinish={handleCreateSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please provide your name!",
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
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please provide your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* <Form.Item
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
                        </Form.Item> */}

            <Form.Item
              name="role"
              label="Role"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Select a role" allowClear>
                <Select.Option value="p3fAdmin">Admin</Select.Option>
                <Select.Option value="p3fSupport">Support user</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please provide your password!",
                },
                {
                  validator: (_, value) => {
                    if (strongRegex.test(value)) {
                      return Promise.resolve();
                    } else if (mediumRegex.test(value)) {
                      return Promise.reject("Password strength : fair");
                    } else {
                      return Promise.reject(
                        "Password strength is weak. Include aphabets/numbers/special characters"
                      );
                    }
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={<h2> Edit User</h2>}
          className="editModal"
          open={editModalVisible}
          onOk={formEdit.submit}
          onCancel={handleEditCancel}
        >
          <Space
            direction="vertical"
            size="middle"
            style={{
              display: "flex",
            }}
          >
            <h4>{"Name: " + formValues.name}</h4>
            <h4>{"Email: " + formValues.email}</h4>
            <Form
              form={formEdit}
              name="EditForm"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: "100%",
              }}
              onFinish={handleEditSubmit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              initialValues={formValues}
            >
              <Form.Item
                name="role"
                label="Role"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="Select a role" allowClear>
                  <Select.Option value="p3fAdmin">Admin</Select.Option>
                  <Select.Option value="p3fSupport">Support user</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default UsersManagement;
