import { useState, useRef } from "react";
import { Button, Checkbox, Divider, Form, Input, Row, Tooltip, Typography } from "antd";
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

export default function TaskRow({ todo, provided }) {
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
        todo.changeTaskTitle(values.edit.charAt(0).toUpperCase() + values.edit.slice(1));
        setIsEditing(false);
    };

    const handleSetEditing = () => {
        setIsEditing(!isEditing);
        setTimeout(() => {
            inputRef.current.focus();
        }, 10)
    }

    return (
        <Row
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center'
                }}
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
                                <Form.Item name="edit">
                                    <Input
                                        ref={inputRef}
                                        onBlur={() => setIsEditing(false)}
                                    />
                                </Form.Item>
                            </Form>) : (
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
            </div>
        </Row>
    )
}