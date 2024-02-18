# LIST-COMPANIES


### Description
- Создать одностраничное приложение `Список компаний`, используя библиотеку React.js.
- При выборе компании отображать список сотрудников компании. Если ни одна компания не выбрана, скрывать список сотрудников.
- Компании, сотрудников можно удалять, добавлять.
- При клике по чекбоксу Выделить все выделяются все Компании, Сотрудники.
- Возможность множественного удаления.
- Все поля таблиц редактируемые, кроме Счетчика сотрудников в таблице Компаниии.
- При добавлении сотрудников у компании обновляется счетчик кол-ва сотрудников.
- Предусмотреть динамическую подгрузку данных Компаний, Сотрудников при скролле таблицы (Жадная загрузка данных).


### DEMO APP
![Demo](https://i.ibb.co/WtT65CG/demo.gif)


### STACK

Front-end:

- [TypeScript](https://www.typescriptlang.org/) (adds additional syntax to JavaScript to support a tighter integration with your editor. Catch errors early in your editor.)
- [React](https://react.dev/) (react-dom, react-redux)
- [Redux](https://redux.js.org/) (@reduxjs/toolkit)
- [Vite](https://vitejs.dev/)

Back-end:

- [json-server](https://github.com/typicode/json-server)(I used json-server for requests)


### QUICK START

1. Clone this repository.
2. [`npm install`](https://docs.npmjs.com/cli/install)
4. Run app `npm run dev` in command line
5. port 5173 (will open on its own)
6. json-server port 5174 (will open on its own)