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
        }
    }))
    .views(self => ({
        get totalPrice() {
            return self.items.reduce((sum, entry) => sum + entry.price, 0)
        }
    }))
