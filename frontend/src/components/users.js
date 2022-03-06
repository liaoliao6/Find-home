import React from 'react';
import { List, Datagrid, TextField, EmailField } from 'react-admin';
import CustomEmailField from "./CustomEmailField";
import ApproveButton from './ApproveButton';




export const UserList = props => (
    <List {...props}>
        <Datagrid >
            <TextField source="name" />
            <CustomEmailField source="email" />
            <TextField source="status"/>
            <TextField source="phone" sortable={false}/> 
            <ApproveButton label="Application" />           
        </Datagrid>       
    </List>
);