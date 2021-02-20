/*
 * @Descripttion: 
 * @Author: weihongfang
 * @Date: 2021-02-17 16:51:21
 * @LastEditTime: 2021-02-19 18:39:58
 */
;
(function () {
    // 页面初始化时文本框获得焦点
    Vue.directive('focus', {
        inserted(el) {
            el.focus()
        }
    })

    // 双击文本框聚焦
    Vue.directive('todo-focus', {
        update(el, binding) {
            if (binding.value) {
                el.focus()
            }
        }
    })

    const app = new Vue({
        data: {
            todos: JSON.parse(localStorage.getItem('todos') || '[]'), //  从 localStorage 读取 todos
            title: '', // 输入框的内容
            currentItem: null, // 存储双击的那个任务项
            filterText: '' // 筛选过的 todos
        },
        computed: {
            // 未完成任务数
            remainCount() {
                return this.todos.filter(item => !item.completed).length
            },
            // 联动切换所有任务状态（全选按钮）
            toggleAll: {
                get() { // 如果所有任务项都已完成，则全选按钮 checkbox 为选中状态（true）
                    return this.todos.every(item => item.completed)
                },
                set() { // 改变全选按钮的状态，所有任务项的状态也随之改变
                    const value = !this.toggleAll
                    this.todos.forEach(item => {
                        item.completed = value
                    })
                }
            },

            filterTodos() { // 筛选 todos 的数据
                switch (this.filterText) {
                    // 未完成
                    case 'active':
                        return this.todos.filter(item => !item.completed)
                        break;

                        // 已完成
                    case 'completed':
                        return this.todos.filter(item => item.completed)
                        break;

                        // 默认全部
                    default:
                        return this.todos
                        break;
                }
            }
        },
        watch: {
            todos: { // 监听 todos 的变化
                handler(val, oldval) { // 若有变化则存入 localStorage
                    localStorage.setItem('todos', JSON.stringify(val))
                },
                deep: true // 监听对象内部的变化，深度监听
            }
        },
        methods: {
            // 新增任务
            handleNewTodo() {
                // 非空校验
                if (!this.title.trim()) {
                    return
                }

                // 把数据添加到列表
                const todo = {
                    id: this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1,
                    title: this.title.trim(),
                    completed: false
                }
                this.todos.push(todo)
                localStorage.setItem('todos', JSON.stringify(this.todos))

                // 清空文本框
                this.title = ''
            },

            // 删除单个任务项
            removeTodo(index) {
                this.todos.splice(index, 1)
            },

            // 删除所有已完成的任务
            handleClearCompleted() { // 遍历 todos,把未完成的元素赋值给 todos
                this.todos = this.todos.filter(item => !item.completed)
            },

            // 双击编辑任务
            handleDblClickEditTodo(todo) {
                this.currentItem = todo
            },

            // 保存编辑任务项的结果
            handleSaveEditTodo(item, index, e) {
                // 获取输入框内容
                const value = e.target.value.trim()

                // 非空验证
                if (!value) { //编辑输入的数据如果是空，则删除整条数据
                    this.todos.splice(index, 1)
                } else {
                    // 更新任务项的 title
                    item.title = value
                    // 取消编辑状态
                    this.currentItem = null
                }
            },

            // Esc 取消编辑
            handlwCancelEdit() {
                this.currentItem = null
            }
        }
    }).$mount('#app')

    // 页面初始化时获取 hash 
    handlehashchange()

    // 当 location.hash 改变时，获取 URL 中的 锚部分(以 '#' 号为开始) 
    window.onhashchange = handlehashchange

    function handlehashchange() {
        app.filterText = window.location.hash.substr(2)
    }
})()