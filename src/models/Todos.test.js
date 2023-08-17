import { toJS } from "mobx";
import { TodoListItem, TodoList } from "./Todos";
import { v4 as uuidv4 } from 'uuid';


it('can create a instance of TodoListItem', () => {
    const item = TodoListItem.create({
        id: uuidv4(),
        isDone: false,
        task: 'Clear the house'
    })

    expect(item.isDone).toBe(false)
    expect(item.task).toBe('Clear the house')
})

it('can change a task title', () => {
    const item = TodoListItem.create({
        id: uuidv4(),
        isDone: false,
        task: 'Clear the house'
    })

    item.changeTaskTitle("Clear my bedroom")

    expect(item.task).toBe('Clear my bedroom')
})

it('can change if the task is done', () => {
    const item = TodoListItem.create({
        id: uuidv4(),
        isDone: false,
        task: 'Clear the house'
    })

    item.changeIsDone(false);

    expect(item.isDone).toBe(false)
})

it('can create a instance of TodoList', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            }
        ]
    })

    expect(list.items.length).toBe(1)
    expect(list.items[0].isDone).toBe(false)
    expect(list.items[0].task).toBe('Clear the house')
})

it('can add a new item into a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            }
        ]
    })

    expect(list.items.length).toBe(1)

    list.add({
        id: uuidv4(),
        isDone: true,
        task: 'Clear my bedroom'
    })

    expect(list.items.length).toBe(2)

    expect(list.items[1].isDone).toBe(true)
    expect(list.items[1].task).toBe('Clear my bedroom')
})

it('can remove a item from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            }
        ]
    })

    list.remove(list.items[0])

    expect(list.items.length).toBe(0)
})

it('can add new items into a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            }
        ]
    })

    expect(list.items.length).toBe(1)

    list.addMany({
        items: [
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    expect(list.items.length).toBe(3)

    expect(list.items[1].isDone).toBe(true)
    expect(list.items[2].isDone).toBe(false)

    expect(list.items[1].task).toBe('Clear my bedroom')
    expect(list.items[2].task).toBe('Buy food')
})

it('can check/uncheck all items from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            },
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    list.checkAll();

    const allTasksAreDone = list.items.every(task => task.isDone === true);

    expect(allTasksAreDone).toBe(true)

    list.checkAll();

    const allTasksAreUnDone = list.items.every(task => task.isDone === false);

    expect(allTasksAreUnDone).toBe(true)
})

it('can remove all done items from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            },
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    list.removeDones();

    expect(list.items.length).toBe(2);
})

it('can get all items from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            },
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    expect(list.tasks.items.length).toBe(3);
})

it('can get all active items from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            },
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    expect(list.activeTasks.items.length).toBe(2);
})

it('can get completed items from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            },
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    expect(list.completedTasks.items.length).toBe(1);
})

it('can get remaining items quantity from a todo list', () => {
    const list = TodoList.create({
        items: [
            {
                id: uuidv4(),
                isDone: false,
                task: 'Clear the house'
            },
            {
                id: uuidv4(),
                isDone: true,
                task: 'Clear my bedroom'
            },
            {
                id: uuidv4(),
                isDone: false,
                task: 'Buy food'
            },
        ]
    })

    expect(list.remainingItemsQtd).toBe(2);
})