import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { observer } from 'mobx-react';
import { onSnapshot } from 'mobx-state-tree';
import { TodoList } from '@/models/Todos';
import { Card, Row, Input, Typography, Form, Space, Radio, Col, Tooltip, Divider, Button, Layout } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskRow from '@/components/TaskRow';
import Head from 'next/head';

const { Header, Content } = Layout;

let list = TodoList.create({ items: [] });

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
];

function Home() {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const inputRef = useRef(null);

  const formatString = (inputString) => {
    let trimmedString = inputString.trim();

    let formattedString = trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);

    return formattedString;
  }

  const handleSendNewTodo = async (values) => {
    list.add({
      id: uuidv4(),
      task: formatString(values.todoTitle),
      isDone: false,
    });
    if (selectedCategory === 'Completed') {
      setSelectedCategory('All');
    }
    await form.resetFields();
    inputRef.current.focus();
  };

  const onSelectCategory = ({ target: { value } }) => {
    setSelectedCategory(value);
  };

  const handleDragItem = (result) => {
    list.changeOrder(result);
  }

  const renderAllTasks = () => {
    const items = list.items;

    if (items.length > 0) {
      return (
        items.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided, snapshot) => (
              <TaskRow todo={todo} provided={provided} isDragging={snapshot.isDragging} />
            )}
          </Draggable>
        ))
      )
    }
    else {
      return (
        <Typography.Text>No active tasks to show</Typography.Text>
      )
    }

  }

  const renderActiveTasks = () => {

    const items = list.activeTasks.items;

    if (items.length > 0) {
      return (
        items.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided, snapshot) => (
              <TaskRow todo={todo} provided={provided} isDragging={snapshot.isDragging} />
            )}
          </Draggable>
        ))
      )
    }
    else {
      return (
        <Typography.Text>No active tasks to show</Typography.Text>
      )
    }

  }

  const renderCompletedTasks = () => {

    const items = list.completedTasks.items;

    if (items.length > 0) {
      return (
        items.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided, snapshot) => (
              <TaskRow todo={todo} provided={provided} isDragging={snapshot.isDragging} />
            )}
          </Draggable>
        ))
      )
    }
    else {
      return (
        <Typography.Text>No completed tasks to show</Typography.Text>
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

    inputRef.current.focus();

  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icon.png" />
        <title>To-do MVC</title>
      </Head>

      <main>
        <Layout style={{ height: '100%', minHeight: '100vh' }}>
          <Header style={{ height: 100 }}>
            <Row
              justify="center"
            // style={{ margin: 0 }}
            >
              <Typography.Title style={{ color: 'white' }}>To-do List</Typography.Title>
            </Row>
          </Header>

          <Content style={{ padding: 50 }}>
            <Row justify="center">
              <Col span={24} >
                <Row
                  gutter={16}
                  justify="center"
                // style={{ margin: 0 }}
                >
                  <Col span={22} style={{ maxWidth: 800 }}>
                    <Form
                      form={form}
                      onFinish={handleSendNewTodo}
                    >
                      <Form.Item
                        name="todoTitle"
                        rules={[
                          { required: true, message: 'Type your task!' },
                          { whitespace: true, message: 'Task title cannot be empty!' }
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="What needs to be done?"
                          prefix={list.items.length > 0 ? (
                            <Tooltip title="Check/Uncheck all tasks">
                              <CheckOutlined
                                onClick={() => {
                                  list.checkAll();
                                }}
                                style={{ marginRight: 5 }}
                              />
                            </Tooltip>
                          ) : <span />}
                          ref={inputRef}
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>

                {list.items.length > 0 && (
                  <Row
                    gutter={16}
                    justify="center"
                  // style={{ margin: 0 }}
                  >
                    <Col span={22} style={{ maxWidth: 800 }}>
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: 0 }}
                      >
                        <DragDropContext onDragEnd={handleDragItem}>
                          <Droppable droppableId='tasks'>
                            {(provided, snapshot) => (
                              <Col
                                style={{
                                  width: '100%',
                                  maxHeight: 'calc(100vh - 350px)',
                                  overflow: 'auto',
                                  padding: 20,
                                  backgroundColor: snapshot.isDraggingOver ? "lightcyan" : 'transparent',
                                  transition: 'background-color 0.5s ease'
                                }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {selectedCategory === "All" && renderAllTasks()}
                                {selectedCategory === "Active" && renderActiveTasks()}
                                {selectedCategory === "Completed" && renderCompletedTasks()}
                                {provided.placeholder}
                              </Col>
                            )}
                          </Droppable>
                        </DragDropContext>

                        <Row
                          justify="space-between"
                          align="middle"
                          style={{
                            // margin: 0,
                            paddingTop: 12,
                            paddingRight: 24,
                            paddingBottom: 12,
                            paddingLeft: 24,
                            borderTop: '1px solid lightGray'
                          }}
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
                            <Tooltip title="Delete all checked tasks">
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
          </Content>
        </Layout>
      </main >
    </>
  )
}

export default observer(Home);
