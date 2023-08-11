import React, { useEffect, useState } from 'react';
import { Card, Row, Input, Typography, Form, Space, Checkbox, Divider } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { TodoList } from '@/models/Todos';
import { v4 as uuidv4 } from 'uuid';
import { onSnapshot } from 'mobx-state-tree';



const list = TodoList.create({ items: [] });



function Home() {
  const [form] = Form.useForm();
  const [remainingTasksQtd, setRemainingTasksQtd] = useState(0);

  const handleSendNewTodo = (values) => {
    list.add({
      id: uuidv4(),
      task: values.todoTitle.charAt(0).toUpperCase() + values.todoTitle.slice(1),
      isDone: false,
    });
    getRemainingTasksQtd();
    form.resetFields();
  };

  const handleSetTodoDone = (todo, checked) => {
    todo.changeIsDone(checked);
    getRemainingTasksQtd();
  };

  const handleDeleteTodo = (todo) => {
    todo.remove();
    getRemainingTasksQtd();
  };

  const getRemainingTasksQtd = () => {
    const count = list.items.reduce((accumulator, task) => {
      if (task.isDone === false) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
    setRemainingTasksQtd(count);

  }

  useEffect(() => {
    const itemsLocalStorage = localStorage.getItem('tasks');

    if (itemsLocalStorage) {
      list.addMany(JSON.parse(itemsLocalStorage));
    }

    onSnapshot(list, snapshot => {
      localStorage.setItem("tasks", JSON.stringify(snapshot))
    })


    getRemainingTasksQtd();
  }, []);

  return (
    <main>
      <div>
        <Row gutter={16} justify="center">
          <Typography.Title>Todos</Typography.Title>
        </Row>
        <Row gutter={16} justify="center">
          <Form form={form} onFinish={handleSendNewTodo} style={{ width: '31rem' }}>
            <Form.Item name="todoTitle">
              <Input size="large" placeholder="What needs to be done?" prefix={list.items.length > 0 && <CheckOutlined onClick={() => {
                list.checkAll();
                getRemainingTasksQtd()
              }} />} />
            </Form.Item>
          </Form>
        </Row>
        {list.toJSON().items.length > 0 && (
          <Row gutter={16} justify="center">
            <Card bordered={true} style={{ width: '31rem' }}>
              <Space direction="vertical" size="middle" >
                {list.items.map((todo) => (
                  <Row key={todo.id} style={{ width: 450 }}>
                    <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Checkbox
                        onChange={(e) => handleSetTodoDone(todo, e.target.checked)}
                        checked={todo.isDone}
                      >
                        <Typography.Text>{todo.task}</Typography.Text>
                      </Checkbox>
                      <CloseOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteTodo(todo)} />
                    </div>
                    <Divider />
                  </Row>
                ))}
              </Space>
              {list.items.length > 0 && (
                <Row justify="space-between">
                  <Typography.Text>{remainingTasksQtd} {remainingTasksQtd > 1 ? "items" : "item"}  left</Typography.Text>
                  <Typography.Text>{remainingTasksQtd} {remainingTasksQtd > 1 ? "items" : "item"}  left</Typography.Text>
                  <Typography.Link onClick={list.removeDones} style={{ width: '7rem' }}>{list.items.some(item => item.isDone === true) ? 'Clear completed' : ''}</Typography.Link>
                </Row>
              )}
            </Card>
          </Row>
        )}

      </div>
    </main>
  )
}

export default observer(Home);
