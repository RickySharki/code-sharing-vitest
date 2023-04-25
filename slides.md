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
image: '../assets/vitest-plugin.jpg'
---

# 对单个测试用例进行测试

在vitest插件中，可以像vscode的`debugger`功能一样，选择运行某个测试case，不需要跑命令

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

<br>

## 工时的逻辑
- `工时`的输出有两种情况，null的时候是`-`，0的时候是0。
- 精度在小数点后一位
- 最大值>=999
- 不能有负数
<br>

## 工时交互（dom）

- 不允许用户输入两位精度的小数或者复数，当有这种情况出现的时候值保持在符合要求的那个数字
- 当出现不允许的情况出现红色报错提示

  


<br>

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>

---

# ！！无法适合编写单元测试的代码

<div class="overflow-y-auto" style="max-height:350px;min-wight">

```ts
    const currentUpdateEstimateLabour = useDebounceFn(() => {
      //第一件事：对比预估工时与保留的值
      if (
        !isEqual(currentLabourInput.value, stagingInputValue.value) &&
        !loading.value
      ) {
        //第二件事：判断预估工时是否合法
        const isNull = isEmpty(currentLabourInput.value);
        const remainingLabour =
          new Decimal(currentLabourInput.value || 0)
            .sub(currentWorkActualLabour.value || 0)
            .toNumber();
        const id = Number(issue.value?.id);

        const data = {
          estimateLabour: isNull
            ? null
            : new Decimal(currentLabourInput.value || 0).toNumber(),
          //父任务剩余工时：修改的预估工时-已消耗工时(actualLabour)
          remainingLabour: remainingLabour,
          //总预估工时 = currentLabourInput.value + 所有子任务的预估工时
          totalEstimateLabour: isNull
            ? null
            : new Decimal(allEstimateLabour.value || 0).toNumber(),
        };
        //第三件事：判断预估工时是否不等于复数
        remainingLabour < 0 ? delete data.remainingLabour : null;
        //第四件事：发送请求
        store.updateValue(data, id).then((res) => {
          if (!res.success) {
            //第五：请求结束后的回调
            currentLabourInput.value = stagingInputValue.value;
          } else {
            noError();
            labourEdit.value = null;
          }
        });
      } else {
        noError();
        labourEdit.value = null;
      }
    }, 500);
```
如上所示确实不适合编写测试代码，因为一个函数确实太耦合了，一个函数做了至少五件事，无数个判断边缘条件。
<br>

`个人认为：能编写出单元测试的代码的可读性以及健壮性会远高于无法编写测试的代码`

<br>
例如我上面的这个代码，说实话现在看来真的就是屎山

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

# 改写预估工时的逻辑

<div class="overflow-y-auto" style="max-height:350px;min-wight">

```ts
    const currentUpdateEstimateLabour = useDebounceFn(() => {
      //第一件事：对比预估工时与保留的值
      if (
        !isEqual(currentLabourInput.value, stagingInputValue.value) &&
        !loading.value
      ) {
        //第二件事：判断预估工时是否合法
        const isNull = isEmpty(currentLabourInput.value);
        const remainingLabour =
          new Decimal(currentLabourInput.value || 0)
            .sub(currentWorkActualLabour.value || 0)
            .toNumber();
        const id = Number(issue.value?.id);

        const data = {
          estimateLabour: isNull
            ? null
            : new Decimal(currentLabourInput.value || 0).toNumber(),
          //父任务剩余工时：修改的预估工时-已消耗工时(actualLabour)
          remainingLabour: remainingLabour,
          //总预估工时 = currentLabourInput.value + 所有子任务的预估工时
          totalEstimateLabour: isNull
            ? null
            : new Decimal(allEstimateLabour.value || 0).toNumber(),
        };
        //第三件事：判断预估工时是否不等于复数
        remainingLabour < 0 ? delete data.remainingLabour : null;
        //第四件事：发送请求
        store.updateValue(data, id).then((res) => {
          if (!res.success) {
            //第五：请求结束后的回调
            currentLabourInput.value = stagingInputValue.value;
          } else {
            noError();
            labourEdit.value = null;
          }
        });
      } else {
        noError();
        labourEdit.value = null;
      }
    }, 500);
```
如上所示确实不适合编写测试代码，因为一个函数确实太耦合了，一个函数做了至少五件事，无数个判断边缘条件。
<br>

`个人认为：能编写出单元测试的代码的可读性以及健壮性会远高于无法编写测试的代码`

<br>
例如我上面的这个代码，说实话现在看来真的就是屎山

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

# 编写预估工时对应的单元测试

<div class="overflow-y-auto" style="max-height:350px;min-wight">

```ts
    const currentUpdateEstimateLabour = useDebounceFn(() => {
      //第一件事：对比预估工时与保留的值
      if (
        !isEqual(currentLabourInput.value, stagingInputValue.value) &&
        !loading.value
      ) {
        //第二件事：判断预估工时是否合法
        const isNull = isEmpty(currentLabourInput.value);
        const remainingLabour =
          new Decimal(currentLabourInput.value || 0)
            .sub(currentWorkActualLabour.value || 0)
            .toNumber();
        const id = Number(issue.value?.id);

        const data = {
          estimateLabour: isNull
            ? null
            : new Decimal(currentLabourInput.value || 0).toNumber(),
          //父任务剩余工时：修改的预估工时-已消耗工时(actualLabour)
          remainingLabour: remainingLabour,
          //总预估工时 = currentLabourInput.value + 所有子任务的预估工时
          totalEstimateLabour: isNull
            ? null
            : new Decimal(allEstimateLabour.value || 0).toNumber(),
        };
        //第三件事：判断预估工时是否不等于复数
        remainingLabour < 0 ? delete data.remainingLabour : null;
        //第四件事：发送请求
        store.updateValue(data, id).then((res) => {
          if (!res.success) {
            //第五：请求结束后的回调
            currentLabourInput.value = stagingInputValue.value;
          } else {
            noError();
            labourEdit.value = null;
          }
        });
      } else {
        noError();
        labourEdit.value = null;
      }
    }, 500);
```
如上所示确实不适合编写测试代码，因为一个函数确实太耦合了，一个函数做了至少五件事，无数个判断边缘条件。
<br>

`个人认为：能编写出单元测试的代码的可读性以及健壮性会远高于无法编写测试的代码`

<br>
例如我上面的这个代码，说实话现在看来真的就是屎山

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
layout: center
class: "text-center"
---

# Thank You！

<br>

## 有什么说的不对的请大家尽情喷我~

[Documentations](https://sli.dev) / [GitHub Repo](https://github.com/Sharkchili1015/vitest-share)

<BarBottom  title="Liga技术分享">
  <Item text="Sharkchili1015">
    <carbon:logo-github />
  </Item>
  <Item text="ligai.cn/">
    <carbon:link />
  </Item>
</BarBottom>
