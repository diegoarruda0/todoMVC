import { types, getParent, destroy, onSnapshot } from "mobx-state-tree"

export const TodoListItem = types
    .model({
        id: types.identifier,
        task: types.string,
        isDone: types.boolean
    })
    .actions(self => ({
        changeTaskTitle(newTaskTitle) {
            self.task = newTaskTitle;
        },
        changeIsDone(isDone) {
            self.isDone = isDone
        },
        remove() {
            getParent(self, 2).remove(self);
        }
    }))

export const TodoList = types
    .model({
        items: types.array(TodoListItem)
    })
    .actions(self => ({
        add(item) {
            self.items.push(item);
        },
        addMany({ items }) {
            items.map((item) => self.add(item))
        },
        remove(item) {
            destroy(item);
        },
        checkAll() {
            const allTasksDone = self.items.every(task => task.isDone === true);

            if (allTasksDone) {
                self.items.map((item) => item.changeIsDone(false));
            }
            else {
                self.items.map((item) => item.changeIsDone(true));
            }
        },
        removeDones() {
            self.items = self.items.filter(item => item.isDone !== true);
        },
        changeOrder(result) {
            if (!result.destination) return;
            const items = Array.from(self.items);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            self.items = items;
        }
    }))
    .views(self => ({
        get tasks() {
            return { items: self.items };
        },
        get activeTasks() {
            return { items: self.items.filter(item => item.isDone === false) };
        },
        get completedTasks() {
            return { items: self.items.filter(item => item.isDone === true) };
        },
        get remainingItemsQtd() {
            return self.items.reduce((accumulator, task) => {
                if (task.isDone === false) {
                    return accumulator + 1;
                }
                return accumulator;
            }, 0);
        }
    }))
