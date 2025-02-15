import React, { useEffect, useState } from 'react';
import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, theme, Result, Spin, Space, Typography } from 'antd';
import './assets/style/index.less';
import AdminSider from './layout/sider';
import AdminHeader from './layout/header';
import { Router, navigate } from '@gatsbyjs/reach-router';

import AdminLoginPage from './pages/login';
import AdminMainPage from './pages';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/reducers/user';
import { getClientInformation } from '../signup/api';
import { useSelector } from 'react-redux';
import { updateClient, updateClientConfig, updateWhiteListedUsers } from '../store/reducers/client';
import { getClientIntegration, getUsersWhiteListing } from './api';
import TeamsIntegration from './pages/teamsIntegration';
import TeamsUsersWhitelisting from './pages/usersWhitelist';
import UserManagement from './pages/userManagement';


const AdminIndexPage = (props) => {
    const dispatch = useDispatch()
    const { Content, Footer, } = Layout;

    const client = useSelector(state => state.client)
    const user = useSelector(state => state.user)

    const [state, setState] = useState({
        clientLoaded: false,
        configsLoaded: false
    })

    useEffect(() => {
        if (!user.isLoggedin || !client.isLoaded) {
            Auth.currentAuthenticatedUser().then((login) => {
                postLoginCheks(login)
            }).catch((err) => {
                navigate("/signup")
            })
        }
    }, [])
    
    const postLoginCheks = (login) => {
        getClientInformation(login.attributes.email).then((res) => {
            dispatch(updateUser({ ...res }))
            dispatch(updateClient({ ...res }))
            if (!client.config.isLoaded) {
                getClientIntegration(res.clientId).then((gci) => {
                    dispatch(updateClientConfig({ ...gci, clientId: res.clientId }))
                    setState({ ...state, clientLoaded: true, configsLoaded: true })
                })
            }
            if (!client.whiteListedUsers.isLoaded) {
                getUsersWhiteListing(res.clientId).then((gwl) => {
                    dispatch(updateWhiteListedUsers(gwl))

                })
            }

        })
    }


    return (

        <Layout className="main-layout">
            <AdminSider props={props} />
            <Layout className="site-layout">
                <AdminHeader />
                {
                    state.clientLoaded ?
                        < Content className="main-container">
                            <Router>
                                <AdminMainPage path="/" client={client} />
                                <AdminLoginPage path="/signup" />
                                <TeamsIntegration path="/teams-integration" client={client} />
                                <TeamsUsersWhitelisting path="/teams-users-whitelisting" client={client} />
                                <UserManagement path="/user-management" client={client}/>
                            </Router>
                        </Content>
                        :
                        <section style={{ display: 'flex', minHeight: '100vh', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
                            <Space size={20}>
                                <Spin size='large' />
                                <Typography.Title level={3}>Please wait while we load the data...</Typography.Title>
                            </Space>
                        </section>
                }
                <Footer className="primary-footer">
                    Presolved © 2020 Created by Presolved
                </Footer>
            </Layout>
        </Layout >

    );
}

export default AdminIndexPage