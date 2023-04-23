---
# replace "./" with "purplin"
# when you copy this example.md file over
# to your own slidev environment and install
# purplin as a module
theme: purplin
colorSchema: 'light'
---

# 浅试前端单元测试

省时还是耗时？

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: intro
---

## 内容目录

<br />
<br />

- 如何开始？
- 单元测试在`工时逻辑`中的应用

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: intro
---

## 下载相关依赖

<br />
<br />

<div class="grid grid-cols-2 gap-x-4">
<div>

我们本次分享主要使用[Vitest](https://vitest.dev/)这个测试框架来进行分享

在前端单元测试中其实主要分为两个部分的测试

- 逻辑部分
- dom部分

逻辑部分：在相关依赖中`@vue/test-utils`是 `Vue.js` 官方提供的一个用于编写单元测试和集成测试的工具库，可以帮助开发者更方便地测试 Vue.js 组件。
<br>
<br>
Dom部分：`happy-dom`主要是一个基于 JavaScript 的虚拟 DOM 库，可以帮助开发者更方便地测试和模拟 DOM 操作。

</div>
<div>

### 前期准备

```ts
# devDependencies

  "devDependencies": {
    "@vue/test-utils": "^2.3.2",
    "@vitejs/plugin-vue": "^4.1.0",
    "@vitest/coverage-istanbul": "^0.30.1",
    "happy-dom": "^9.8.4",
    "typescript": "^4.9.3",
    "vite": "^4.2.0",
    "vitest": "^0.30.1",
    "vue-tsc": "^1.2.0"
  }
```

</div>
</div>

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: quote
position: left
---

# TodoList组件（Dom）
<div class="grid grid-cols-2 gap-x-2">
<div class="flex items-center justify-center">

在todolist组件中我们实现了`添加`、`删除`、`完成`,`command命令式添加`的基础功能，具体功能稍后请看演示

</div>
<div class="overflow-y-auto" style="max-height:350px;min-wight">
```ts
<template>
    <h1>ToDo App</h1>
    <div class="form">
      <label>New ToDo </label>
      <input v-model="newTodo" id="newTodo" name="newTodo" autocomplete="off" />
      <button id="newBtn" @click="addTodo()">Add ToDo</button>
      <button id="removeAllBtn" @click="store.removeAll">Remove All</button>
    </div>
    <h2>ToDo List</h2>
    <ul class="todo-ul">
      <li v-for="(todo, index) in todoList" :key="index">
        <span :class="{ done: todo.done }" @click="store.doneTodo(index)">{{
          todo.content
        }}</span>
        <button id="removeBtn" @click="store.removeTodo(index)">Remove</button>
      </li>
    </ul>
    <h4 id="empty" v-if="todoList.length === 0">Empty list.</h4>
  </template>
<script lang="ts" setup>
import { ref } from "vue";
import { useTodotore } from "../store/modules/todo";

const store = useTodotore();
const { todoList } = store;

const newTodo = ref<String>("");
function addTodo() {
  store.addTodo(newTodo.value as string);
    newTodo.value = "";
  }
</script>
```
</div>
</div>
<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: quote
position: left
---

# TodoListStore（逻辑）

<div class="grid grid-cols-2 gap-x-2">
<div class="flex items-center justify-center p-4">

TodoList组件所依赖的所有数据都在store中管理，具体涉及到的逻辑操作都在store中进行这样更有利于编写测试代码（并不一定都需要在store中管理，可以直接在组件中对数据进行管理，一样可以编写测试代码）,具体逻辑看演示。

</div>
<div class="overflow-y-auto" style="max-height:350px;min-wight">

```ts
import { defineStore } from "pinia";
import { ref, watch } from "vue";
type Todo = {
  done: boolean;
  content: string;
};
export const useTodotore = defineStore("todo", () => {
  const count = ref(0);
  const add = () => {
    count.value++;
  };
  const defaultData = [
    {
      done: false,
      content: "Write a blog post",
    },
  ];
  const isRealClear = ref<Boolean>(false)
  const todoList = ref<Todo[]>([]);
  watch(
    () => todoList.value,
    () => {
      if (todoList.value.length === 0 && !isRealClear.value) {
        todoList.value.push(...defaultData);
      }
    },{
      immediate:true
    }
  );
  const addTodo = (todo: string) => {
    const isTop = todo.includes("top:");
    const isDone = todo.includes("done:");
    const addContent = todo.replace("top:", "").replace("done:", "");
    if (isTop) {
      todoList.value.unshift({
        done: isDone,
        content: addContent,
      });
      return;
    }
    todoList.value.push({
      done: isDone,
      content: addContent,
    });
  };
  const removeTodo = (index: number) => {
    todoList.value.splice(index, 1);
    return todoList.value[index]
  };
  const doneTodo = (index:number) =>{
    todoList.value[index].done = !todoList.value[index].done
  }

  const removeAll = () =>{
    isRealClear.value = true
    todoList.value = []
  }
  return {
    count,
    add,
    addTodo,
    removeTodo,
    todoList,
    doneTodo,
    removeAll
  };
});

```
</div>
</div>
<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: image-x
image: '/assets/vitest-plugin.gif'
---

# 对单个测试用例进行测试

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---

# 单元测试在`工时逻辑`中的应用

Slidev is a slides maker and presenter designed for developers, consist of the following features
  
- 📝 **Text-based** - focus on the content with Markdown, and then style them later
- 🎨 **Themable** - theme can be shared and used with npm packages
- 🧑‍💻 **Developer Friendly** - code highlighting, live coding with autocompletion
- 🤹 **Interactive** - embedding Vue components to enhance your expressions
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export into PDF, PNGs, or even a hostable SPA
- 🛠 **Hackable** - anything possible on a webpage

<br>
<br>

Read more about [Why Slidev?](https://sli.dev/guide/why)

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---

# Navigation

Hover on the bottom-left corner to see the navigation's controls panel

### Keyboard Shortcuts

|     |     |
| --- | --- |
| <kbd>space</kbd> / <kbd>tab</kbd> / <kbd>right</kbd> | next animation or slide |
| <kbd>left</kbd> | previous animation or slide |
| <kbd>up</kbd> | previous slide |
| <kbd>down</kbd> | next slide |

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: image-right
image: 'https://user-images.githubusercontent.com/13499566/138950614-52ec045b-aa93-4d52-91df-b782cc9c7143.jpg'
---

# Code

Use code snippets and get the highlighting directly!

```ts
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = {...user, ...update}  
  saveUser(id, newUser)
}
```

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---
layout: center
class: "text-center"
---

# Learn More

[Documentations](https://sli.dev) / [GitHub Repo](https://github.com/slidevjs/slidev)

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>
