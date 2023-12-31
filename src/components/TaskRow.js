import React, { useState, useRef } from "react";
import { Button, Checkbox, Divider, Form, Input, Row, Tooltip, Typography } from "antd";
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

export default function TaskRow({ todo, provided, isDragging }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const isChecked = todo.isDone;

    const inputRef = useRef(null);

    const handleSetTodoDone = (todo, checked) => {
        todo.changeIsDone(checked);
    };

    const handleDeleteTodo = (todo) => {
        todo.remove();
    };

    const handleEdit = (values) => {
        if (values.edit.trim()) {
            todo.changeTaskTitle(values.edit.charAt(0).toUpperCase() + values.edit.slice(1));
        }
        setIsEditing(false);
        form.resetFields();
    };

    const handleSetEditing = () => {
        setIsEditing(!isEditing);
        setTimeout(() => {
            inputRef.current.focus();
        }, 10)
    }

    const rowStyle = {
        backgroundColor: isDragging ? 'lightblue' : 'transparent',
        transition: 'background-color 1s ease',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px',
        alignItems: 'center',
        ...provided.draggableProps.style,
    };

    return (
        <Row
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={rowStyle}
        >
            <div>
                <Checkbox
                    onChange={(e) => handleSetTodoDone(todo, e.target.checked)}
                    checked={isChecked}
                >
                    {isEditing ? (
                        <Form
                            layout="inline"
                            size="small"
                            onFinish={handleEdit}
                            form={form}
                            initialValues={{ edit: todo.task }}
                        >
                            <Form.Item
                                name="edit"
                            >
                                <Input
                                    ref={inputRef}
                                    onBlur={() => handleEdit({ edit: inputRef.current.input.value })}
                                />
                            </Form.Item>
                        </Form>
                    ) : (
                        <Typography.Text delete={isChecked} disabled={isChecked}>{todo.task}</Typography.Text>
                    )}

                </Checkbox>

                {!isChecked && !isEditing && (
                    <Tooltip title="Edit current task">
                        <EditOutlined style={{ cursor: 'pointer' }} onClick={() => handleSetEditing()} />
                    </Tooltip>
                )}
            </div>

            <Tooltip title="Delete current task">
                <Button
                    type="primary"
                    danger
                    onClick={() => handleDeleteTodo(todo)}
                >
                    <CloseOutlined />
                </Button>
            </Tooltip>
        </Row>
    )
}
