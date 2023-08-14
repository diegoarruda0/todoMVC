import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { observer } from 'mobx-react';
import { onSnapshot } from 'mobx-state-tree';
import { TodoList } from '@/models/Todos';
import { Card, Row, Input, Typography, Form, Space, Radio, Col, Tooltip, Divider } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskRow from '@/components/TaskRow';


let list = TodoList.create({ items: [] });

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
];

function Home() {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSendNewTodo = (values) => {
    list.add({
      id: uuidv4(),
      task: values.todoTitle.charAt(0).toUpperCase() + values.todoTitle.slice(1),
      isDone: false,
    });
    form.resetFields();
  };

  const onSelectCategory = ({ target: { value } }) => {
    setSelectedCategory(value);
  };

  const handleDragItem = (result) => {
    console.log(result);
    list.changeOrder(result);
  }

  const renderAllTasks = () => {

    const items = list.items;

    if (items.length > 0) {
      return (
        items.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <TaskRow todo={todo} provided={provided} />
            )}
          </Draggable>
        ))
      )
    }
    else {
      return (
        <>
          <Typography.Text>No active tasks to show</Typography.Text>
          <Divider />
        </>
      )
    }

  }

  const renderActiveTasks = () => {

    const items = list.activeTasks.items;

    if (items.length > 0) {
      return (
        items.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <TaskRow todo={todo} provided={provided} />
            )}
          </Draggable>
        ))
      )
    }
    else {
      return (
        <>
          <Typography.Text>No active tasks to show</Typography.Text>
          <Divider />
        </>
      )
    }

  }

  const renderCompletedTasks = () => {

    const items = list.completedTasks.items;

    if (items.length > 0) {
      return (
        items.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <TaskRow todo={todo} provided={provided} />
            )}
          </Draggable>
        ))
      )
    }
    else {
      return (
        <>
          <Typography.Text>No completed tasks to show</Typography.Text>
          <Divider />
        </>
      )
    }

  }

  useEffect(() => {
    const itemsLocalStorage = localStorage.getItem('tasks');

    if (itemsLocalStorage) {
      list.addMany(JSON.parse(itemsLocalStorage));
    }

    onSnapshot(list, snapshot => {
      localStorage.setItem("tasks", JSON.stringify(snapshot))
    })

  }, []);

  return (
    <main>
      <Row>
        <Col span={24}>
          <Row
            gutter={16}
            justify="center"
          >
            <Typography.Title>To-do List</Typography.Title>
          </Row>

          <Row
            gutter={16}
            justify="center"
          >
            <Col span={10}>
              <Form
                form={form}
                onFinish={handleSendNewTodo}
              >
                <Form.Item
                  name="todoTitle"
                  rules={[{ required: true, message: 'Type your task!' }]}
                >
                  <Input
                    size="large"
                    placeholder="What needs to be done?"
                    prefix={list.items.length > 0 && (
                      <Tooltip title="Check all tasks">
                        <CheckOutlined onClick={() => {
                          list.checkAll();
                        }} />
                      </Tooltip>
                    )}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>

          {list.items.length > 0 && (
            <Row
              gutter={16}
              justify="center"
            >
              <Col span={10}>
                <Card bordered={true} >
                  <DragDropContext onDragEnd={handleDragItem}>
                    <Droppable droppableId='tasks'>
                      {(provided) => (
                        <Space
                          direction="vertical"
                          size="middle"
                          style={{ width: '100%' }}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {selectedCategory === "All" && renderAllTasks()}
                          {selectedCategory === "Active" && renderActiveTasks()}
                          {selectedCategory === "Completed" && renderCompletedTasks()}
                          {provided.placeholder}
                        </Space>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <Row
                    justify="space-between"
                    align="middle"
                  >
                    <Col span={6}>
                      <Typography.Text>{list.remainingItemsQtd} {list.remainingItemsQtd > 1 ? "items" : "item"}  left</Typography.Text>
                    </Col>
                    <Divider type='vertical' />
                    <Col span={8}>
                      <Radio.Group
                        options={categories}
                        onChange={onSelectCategory}
                        value={selectedCategory}
                        optionType="button"
                        size='small'
                        buttonStyle="solid"
                      />
                    </Col>
                    <Divider type='vertical' />
                    <Col span={5}>
                      <Tooltip title="Delete current task">
                        <Typography.Link onClick={list.removeDones}>
                          {list.items.some(item => item.isDone === true) ? 'Clear completed' : ''}
                        </Typography.Link>
                      </Tooltip >
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row >
    </main >
  )
}

export default observer(Home);
